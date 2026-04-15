import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { z } from "zod";

// ── Zod schema ────────────────────────────────────────────────────────────────

const ParsedQuestionSchema = z.object({
  question_text: z.string().min(5),
  option_a: z.string().min(1),
  option_b: z.string().min(1),
  option_c: z.string().nullable().optional(),
  option_d: z.string().nullable().optional(),
  correct: z.enum(["a", "b", "c", "d"]).nullable(),
  marks: z.number().int().positive().default(1),
  explanation: z.string().nullable().optional(),
});

type ParsedQuestion = z.infer<typeof ParsedQuestionSchema>;

const ParseResponseSchema = z.object({
  questions: z.array(ParsedQuestionSchema),
  parse_warnings: z.array(z.string()).optional().default([]),
});

// ── Compact system prompt (~300 tokens vs previous ~180) ──────────────────────
// Smaller prompt = more room for user content in the 12k TPM window.

const SYSTEM_PROMPT = `MCQ parser. Extract questions from text. Return JSON only:
{"questions":[{"question_text":"...","option_a":"...","option_b":"...","option_c":null,"option_d":null,"correct":"a","marks":1,"explanation":null}],"parse_warnings":[]}
Rules: parse ALL questions; map (1)(2)(3)(4) or A)B)C)D) to a/b/c/d; detect correct from ✅ ☑ ✓ * Ans: Answer: (correct) bold markers; null if unknown; preserve text verbatim.`;

// ── Tier-1: Regex parser (handles ✅ and common formats with zero AI calls) ───

const OPTION_PREFIX = /^(?:\(?[abcdABCD1234]\)?[\.\):\s]+|[abcdABCD1234][\.\):\s]+)/;

// Markers that indicate the correct answer on an option line
const CORRECT_MARKERS = [
  /✅/, /☑/, /✓/,
  /\bcorrect\b/i, /\bright answer\b/i, /\(correct\)/i,
];

// Answer line patterns:  "Ans: b"  "Answer: C"  "Ans.(b)"  "Answer- C"
const ANS_LINE = /^(?:ans(?:wer)?)[.\-:\s]+\(?([abcdABCD1234])\)?/i;

function detectCorrect(text: string): "a" | "b" | "c" | "d" | null {
  const match = text.match(/([abcdABCD1234])/);
  if (!match) return null;
  const map: Record<string, "a" | "b" | "c" | "d"> = {
    a: "a", A: "a", "1": "a",
    b: "b", B: "b", "2": "b",
    c: "c", C: "c", "3": "c",
    d: "d", D: "d", "4": "d",
  };
  return map[match[1]] ?? null;
}

function stripOptionPrefix(text: string): string {
  return text.replace(OPTION_PREFIX, "").trim();
}

function hasCorrectMarker(text: string): boolean {
  return CORRECT_MARKERS.some((r) => r.test(text));
}

/**
 * Try to parse raw text with regex.
 * Returns null if the format doesn't look like a structured MCQ list.
 */
function regexParse(raw: string): ParsedQuestion[] | null {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const questions: ParsedQuestion[] = [];
  let i = 0;

  // Need at least one question-number pattern to trust regex mode
  const hasQNumbers = lines.some((l) => /^(?:Q\.?\s*\d+|^\d+[\.\)]\s+\S)/.test(l));
  if (!hasQNumbers) return null;

  while (i < lines.length) {
    const qLine = lines[i];

    // Detect question start: "1." "Q1." "Q. 1" "1)"
    const qMatch = qLine.match(/^(?:Q\.?\s*)?(\d+)[\.\):\s]+(.+)/i);
    if (!qMatch) { i++; continue; }

    const questionText = qMatch[2].trim();
    i++;

    const options: string[] = [];
    const optionLines: string[] = [];
    let correctIdx: number | null = null;
    let answerLine: string | null = null;

    // Collect option lines
    while (i < lines.length) {
      const line = lines[i];

      // Stop if next question starts
      if (/^(?:Q\.?\s*)?\d+[\.\):\s]+/.test(line) && !OPTION_PREFIX.test(line)) break;

      // Answer declaration line
      if (ANS_LINE.test(line)) {
        answerLine = line;
        i++;
        continue;
      }

      // Option line
      if (OPTION_PREFIX.test(line)) {
        const isCorrect = hasCorrectMarker(line);
        const clean = stripOptionPrefix(
          line
            .replace(/✅|☑|✓/g, "")
            .replace(/\(correct\)/gi, "")
            .replace(/\bright answer\b/gi, "")
            .trim()
        );
        optionLines.push(line);
        options.push(clean);
        if (isCorrect) correctIdx = options.length - 1;
        i++;
        continue;
      }

      // If we already have 2+ options and this doesn't look like an option, stop
      if (options.length >= 2) break;
      i++;
    }

    if (options.length < 2) continue; // Not a valid question

    // Determine correct from answerLine if not already found via marker
    if (correctIdx === null && answerLine) {
      const m = answerLine.match(ANS_LINE);
      if (m) {
        const map: Record<string, number> = {
          a: 0, A: 0, "1": 0,
          b: 1, B: 1, "2": 1,
          c: 2, C: 2, "3": 2,
          d: 3, D: 3, "4": 3,
        };
        correctIdx = map[m[1]] ?? null;
      }
    }

    const correctMap: ("a" | "b" | "c" | "d")[] = ["a", "b", "c", "d"];

    questions.push({
      question_text: questionText,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2] ?? null,
      option_d: options[3] ?? null,
      correct: correctIdx !== null ? (correctMap[correctIdx] ?? null) : null,
      marks: 1,
      explanation: null,
    });
  }

  // Only trust result if we got a reasonable number of questions
  return questions.length >= 2 ? questions : null;
}

// ── Tier-2: AI parse with chunking ───────────────────────────────────────────
// Splits into chunks of 25 questions worth of text to stay within 12k TPM.

const CHUNK_CHARS = 6000; // ~4000 tokens of user text per call — safe buffer

function chunkText(text: string): string[] {
  if (text.length <= CHUNK_CHARS) return [text];

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + CHUNK_CHARS;
    if (end >= text.length) {
      chunks.push(text.slice(start));
      break;
    }
    // Try to cut at a question boundary (newline before a question number)
    const boundary = text.lastIndexOf("\n", end);
    if (boundary > start + CHUNK_CHARS / 2) {
      end = boundary;
    }
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}

async function groqParseChunk(
  groq: OpenAI,
  chunk: string,
  chunkIndex: number
): Promise<ParsedQuestion[]> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.05,
    max_tokens: 4000,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Parse ALL MCQ questions from this text (chunk ${chunkIndex + 1}):\n\n${chunk}`,
      },
    ],
  });

  const rawJson = completion.choices[0]?.message?.content ?? "{}";
  const jsonData = JSON.parse(rawJson);
  const result = ParseResponseSchema.safeParse(jsonData);
  return result.success ? result.data.questions : [];
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: educator } = await supabase
    .from("educators")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!educator)
    return NextResponse.json({ error: "Forbidden: educators only" }, { status: 403 });

  // Parse body
  let raw_text: string;
  try {
    const body = await request.json();
    raw_text = body?.raw_text;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!raw_text || typeof raw_text !== "string")
    return NextResponse.json({ error: "raw_text is required" }, { status: 400 });

  if (raw_text.length < 20)
    return NextResponse.json(
      { error: "Text too short — paste at least one complete question" },
      { status: 400 }
    );

  if (raw_text.length > 200000)
    return NextResponse.json(
      { error: "Text too long — maximum 200,000 characters" },
      { status: 400 }
    );

  const warnings: string[] = [];

  // ── Tier 1: Try regex parse first (zero tokens, instant) ──────────────────
  const regexResult = regexParse(raw_text);
  if (regexResult && regexResult.length > 0) {
    const flagged = regexResult.filter((q) => q.correct === null).length;
    if (flagged > 0) {
      warnings.push(
        `${flagged} question(s) have no detectable correct answer — please mark them manually.`
      );
    }
    const questions = regexResult.map((q) => ({
      ...q,
      option_c: q.option_c ?? null,
      option_d: q.option_d ?? null,
      explanation: q.explanation ?? null,
      flagged: q.correct === null,
    }));

    return NextResponse.json({
      questions,
      parse_warnings: warnings,
      total: questions.length,
      flagged_count: flagged,
      method: "regex", // for debugging
    });
  }

  // ── Tier 2: AI parse with chunking ────────────────────────────────────────
  const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY,
    baseURL: process.env.GROQ_API_KEY
      ? "https://api.groq.com/openai/v1"
      : undefined,
  });

  const chunks = chunkText(raw_text);
  const allQuestions: ParsedQuestion[] = [];

  try {
    // Process chunks sequentially to respect TPM rate limits
    for (let i = 0; i < chunks.length; i++) {
      const chunkQuestions = await groqParseChunk(groq, chunks[i], i);
      allQuestions.push(...chunkQuestions);

      // Small delay between chunks to avoid hitting TPM limit
      if (i < chunks.length - 1) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  } catch (err) {
    console.error("[parse-questions] AI parse error:", err);
    return NextResponse.json(
      {
        error:
          "Failed to parse questions. Try pasting fewer questions at a time, or add question numbers (1. 2. 3.) to help the parser.",
      },
      { status: 422 }
    );
  }

  if (allQuestions.length === 0) {
    return NextResponse.json(
      {
        error:
          "No questions found. Make sure questions are numbered (1. 2. 3.) and options are labeled (A. B. C. D.).",
      },
      { status: 422 }
    );
  }

  const flagged = allQuestions.filter((q) => q.correct === null).length;
  if (flagged > 0) {
    warnings.push(
      `${flagged} question(s) have no detectable correct answer — please mark them manually.`
    );
  }

  const questions = allQuestions.map((q) => ({
    ...q,
    option_c: q.option_c ?? null,
    option_d: q.option_d ?? null,
    explanation: q.explanation ?? null,
    flagged: q.correct === null,
  }));

  return NextResponse.json({
    questions,
    parse_warnings: warnings,
    total: questions.length,
    flagged_count: flagged,
    method: "ai-chunked",
  });
}
