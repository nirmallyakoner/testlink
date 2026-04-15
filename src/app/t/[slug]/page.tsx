import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TestEngine } from "./TestEngine";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: test } = await supabase
    .from("tests")
    .select("title, subject, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!test) return { title: "Test Not Found — TestLink" };

  return {
    title: `${test.title} — TestLink`,
    description:
      test.description ?? `Take ${test.title} on TestLink and see how you rank.`,
  };
}

export default async function StudentTestPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch published test
  const { data: test } = await supabase
    .from("tests")
    .select(
      "id, title, slug, subject, description, time_limit_mins, question_count, total_marks, educator_id"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!test) notFound();

  // Fetch educator name
  const { data: educator } = await supabase
    .from("educators")
    .select("name")
    .eq("id", test.educator_id)
    .single();

  // Fetch questions WITHOUT correct answers (security: answer check happens in Edge Fn)
  const { data: questions } = await supabase
    .from("questions")
    .select(
      "id, order_index, question_text, option_a, option_b, option_c, option_d, marks"
    )
    .eq("test_id", test.id)
    .order("order_index", { ascending: true });

  // Check current session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  // Check if this student has already submitted
  let alreadySubmitted = false;
  if (user) {
    const { data: existing } = await supabase
      .from("submissions")
      .select("id")
      .eq("test_id", test.id)
      .eq("student_id", user.id)
      .single();
    alreadySubmitted = !!existing;
  }

  return (
    <TestEngine
      test={{
        id: test.id,
        title: test.title,
        slug: test.slug,
        subject: test.subject,
        description: test.description,
        time_limit_mins: test.time_limit_mins,
        question_count: test.question_count,
        total_marks: test.total_marks,
        educator_name: educator?.name ?? "Educator",
      }}
      questions={questions ?? []}
      isLoggedIn={isLoggedIn}
      alreadySubmitted={alreadySubmitted}
    />
  );
}
