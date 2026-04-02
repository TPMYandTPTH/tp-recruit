import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/screening?roleId=xxx — get screening questions for a role
export async function GET(request: NextRequest) {
  const roleId = request.nextUrl.searchParams.get("roleId");

  const questions = await prisma.screeningQuestion.findMany({
    where: {
      isActive: true,
      OR: [{ roleId: null }, { roleId: roleId || undefined }],
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ questions });
}

// POST /api/screening — submit screening answers
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { candidateId, answers } = body as {
    candidateId: string;
    answers: Array<{ questionId: string; answer: string | number | boolean }>;
  };

  // Fetch the candidate
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: { role: true },
  });

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  // Fetch questions to check for auto-fail conditions
  const questionIds = answers.map((a) => a.questionId);
  const questions = await prisma.screeningQuestion.findMany({
    where: { id: { in: questionIds } },
  });

  // Check for auto-fail answers
  const failReasons: string[] = [];
  let extractedSalary: number | null = null;

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;

    // Check auto-fail
    if (
      question.failValue &&
      String(answer.answer).toLowerCase() === question.failValue.toLowerCase()
    ) {
      failReasons.push(question.question);
    }

    // Extract salary expectation
    if (question.category === "SALARY" && typeof answer.answer === "number") {
      extractedSalary = answer.answer;
    }
  }

  const passed = failReasons.length === 0;

  // Update candidate
  await prisma.candidate.update({
    where: { id: candidateId },
    data: {
      screeningData: JSON.stringify(answers),
      expectedSalary: extractedSalary,
      stage: passed ? "ASSESSMENT_PENDING" : "SCREENING_FAILED",
      screeningPassedAt: passed ? new Date() : null,
      stageUpdatedAt: new Date(),
    },
  });

  // Log the action
  await prisma.auditLog.create({
    data: {
      entityType: "Candidate",
      entityId: candidateId,
      action: passed ? "SCREENING_PASSED" : "SCREENING_FAILED",
      details: JSON.stringify({
        passed,
        failReasons,
        expectedSalary: extractedSalary,
      }),
      performedBy: "SYSTEM",
    },
  });

  return NextResponse.json({
    passed,
    failReasons,
    nextStage: passed ? "ASSESSMENT_PENDING" : "SCREENING_FAILED",
    // If passed, include the assessment link (from the role config or Hallo.ai)
    assessmentLink: passed ? candidate.assessmentLink : null,
  });
}
