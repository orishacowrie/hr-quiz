import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { LEVELS } from "@/lib/quiz-data";

interface AnswerPayload {
  question_number: number;
  answer_index: number;
  answer_score: number;
}

interface SubmitPayload {
  score: number;
  level: number;
  level_title: string;
  answers: AnswerPayload[];
}

export async function POST(req: NextRequest) {
  let body: SubmitPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { score, level, level_title, answers } = body;

  if (
    typeof score !== "number" ||
    typeof level !== "number" ||
    !level_title ||
    !Array.isArray(answers)
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Guard against out-of-range level index
  if (level < 0 || level >= LEVELS.length) {
    return NextResponse.json({ error: "Invalid level index" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: result, error: resultError } = await admin
    .from("results")
    .insert({ score, level, level_title })
    .select("id")
    .single();

  if (resultError) {
    console.error("Supabase results insert error:", resultError);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }

  const answerRows = answers.map((a) => ({
    result_id: result.id,
    question_number: a.question_number,
    answer_index: a.answer_index,
    answer_score: a.answer_score,
  }));

  const { error: answersError } = await admin.from("answers").insert(answerRows);

  if (answersError) {
    console.error("Supabase answers insert error:", answersError);
    return NextResponse.json({ error: "Failed to save answers" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, resultId: result.id });
}
