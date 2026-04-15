import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { z } from "zod";

// ── Zod schema for a single parsed question ──────────────────────────────────
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

const ParseResponseSchema = z.object({
  questions: z.array(ParsedQuestionSchema),
  parse_warnings: z.array(z.string()).optional().default([]),
});

const SYSTEM_PROMPT = `You are an MCQ parser for Indian educators. Extract multiple choice questions from raw text.

Return a JSON object with:
- "questions": array of question objects
- "parse_warnings": array of strings describing any issues found

Each question object must have:
- "question_text": string (the question)
- "option_a": string (option A)
- "option_b": string (option B)  
- "option_c": string or null (option C if present)
- "option_d": string or null (option D if present)
- "correct": "a", "b", "c", or "d" — or null if not determinable
- "marks": number (default 1 if not specified)
- "explanation": string or null

Rules:
- Parse ALL questions found in the text, even if formatting is inconsistent
- For numbered options like (1)(2)(3)(4), map to a/b/c/d in order
- If the correct answer is marked (e.g. asterisk, underline hint, "Ans:", "Answer:", "(Correct)"), extract it
- If correct answer cannot be determined, set correct to null and add a warning
- Ignore headers, page numbers, and irrelevant text
- Preserve the original question text and option text verbatim
- Return ONLY valid JSON, no markdown, no explanation outside JSON`;

export async function POST(request: NextRequest) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify user is an educator
  const { data: educator } = await supabase
    .from("educators")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!educator) {
    return NextResponse.json({ error: "Forbidden: educators only" }, { status: 403 });
  }

  // ── Parse request body ──────────────────────────────────────────────────────
  let raw_text: string;
  try {
    const body = await request.json();
    raw_text = body?.raw_text;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!raw_text || typeof raw_text !== "string") {
    return NextResponse.json({ error: "raw_text is required" }, { status: 400 });
  }

  if (raw_text.length < 20) {
    return NextResponse.json(
      { error: "Text too short — paste at least one complete question" },
      { status: 400 }
    );
  }

  if (raw_text.length > 50000) {
    return NextResponse.json(
      { error: "Text too long — maximum 50,000 characters" },
      { status: 400 }
    );
  }

  // ── Call Groq (llama-3.3-70b-versatile) ────────────────────────────────────
  // Groq is OpenAI-API-compatible — just set baseURL to Groq's endpoint.
  const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  let parsed: z.infer<typeof ParseResponseSchema>;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Parse the following text and extract all MCQ questions:\n\n${raw_text}`,
        },
      ],
    });

    const rawJson = completion.choices[0]?.message?.content ?? "{}";
    const jsonData = JSON.parse(rawJson);
    parsed = ParseResponseSchema.parse(jsonData);
  } catch (err) {
    console.error("[parse-questions] Groq or parse error:", err);
    return NextResponse.json(
      { error: "Failed to parse questions. Please check formatting and try again." },
      { status: 422 }
    );
  }

  // Annotate questions with flagged = true where correct is null
  const questions = parsed.questions.map((q) => ({
    ...q,
    option_c: q.option_c ?? null,
    option_d: q.option_d ?? null,
    explanation: q.explanation ?? null,
    flagged: q.correct === null,
  }));

  return NextResponse.json({
    questions,
    parse_warnings: parsed.parse_warnings,
    total: questions.length,
    flagged_count: questions.filter((q) => q.flagged).length,
  });
}
