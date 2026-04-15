import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const { id: testId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: test } = await supabase
    .from("tests")
    .select("id, is_published")
    .eq("id", testId)
    .eq("educator_id", user.id)
    .single();

  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!test.is_published)
    return NextResponse.json({ error: "Test is already a draft" }, { status: 409 });

  // Block if students have submitted
  const { count } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("test_id", testId);

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      {
        error: `Cannot unpublish — ${count} student(s) have already submitted this test.`,
      },
      { status: 409 }
    );
  }

  const { error } = await supabase
    .from("tests")
    .update({ is_published: false })
    .eq("id", testId);

  if (error) return NextResponse.json({ error: "Failed to unpublish" }, { status: 500 });
  return NextResponse.json({ success: true });
}
