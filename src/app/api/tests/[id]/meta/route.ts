import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const MetaInput = z.object({
  title: z.string().min(1).max(200).optional(),
  subject: z.string().max(100).nullable().optional(),
  time_limit_mins: z.number().int().positive().nullable().optional(),
});

export async function PUT(request: NextRequest, { params }: Params) {
  const { id: testId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const { data: test } = await supabase
    .from("tests")
    .select("id, is_published")
    .eq("id", testId)
    .eq("educator_id", user.id)
    .single();

  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let input: z.infer<typeof MetaInput>;
  try {
    input = MetaInput.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { error } = await supabase
    .from("tests")
    .update({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.subject !== undefined ? { subject: input.subject } : {}),
      ...(input.time_limit_mins !== undefined
        ? { time_limit_mins: input.time_limit_mins }
        : {}),
    })
    .eq("id", testId);

  if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  return NextResponse.json({ success: true });
}
