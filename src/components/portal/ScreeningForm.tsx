"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface Question {
  id: string;
  category: string;
  question: string;
  type: string;
  options: string | null;
  isRequired: boolean;
}

interface Props {
  candidateId: string;
  roleId: string;
}

export default function ScreeningForm({ candidateId, roleId }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; failReasons: string[] } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetch(`/api/screening?roleId=${roleId}`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions);
        setLoading(false);
      });
  }, [roleId]);

  const handleAnswer = (questionId: string, value: string | number | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    const res = await fetch("/api/screening", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId, answers: formattedAnswers }),
    });

    const data = await res.json();
    setResult(data);
    setSubmitting(false);

    if (data.passed) {
      // Refresh page after short delay to show next stage
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#4B4C6A] animate-spin" />
      </div>
    );
  }

  // Show result
  if (result) {
    return (
      <div className="text-center py-8">
        {result.passed ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Screening Complete!
            </h2>
            <p className="text-gray-500">
              You passed the screening. Moving to the next stage...
            </p>
          </>
        ) : (
          <>
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You for Your Interest
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Unfortunately, you do not meet the eligibility requirements for
              this role at this time. We encourage you to check back for future
              opportunities.
            </p>
          </>
        )}
      </div>
    );
  }

  // Show questions one at a time
  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const hasAnswer = currentQuestion && answers[currentQuestion.id] !== undefined;

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No screening questions configured for this role.</p>
      </div>
    );
  }

  const parsedOptions = currentQuestion.options
    ? JSON.parse(currentQuestion.options)
    : [];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Screening</h2>
          <span className="text-sm text-gray-400">
            {currentStep + 1} of {questions.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-[#4B4C6A] h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="py-6">
        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 mb-3">
          {currentQuestion.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentQuestion.question}
        </h3>

        {/* Question input based on type */}
        {currentQuestion.type === "YES_NO" && (
          <div className="flex gap-3">
            {["Yes", "No"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(currentQuestion.id, opt === "Yes")}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  answers[currentQuestion.id] === (opt === "Yes")
                    ? "border-[#4B4C6A] bg-[#eeedf2] text-[#4B4C6A]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === "MULTIPLE_CHOICE" && (
          <div className="space-y-2">
            {parsedOptions.map((opt: string) => (
              <button
                key={opt}
                onClick={() => handleAnswer(currentQuestion.id, opt)}
                className={`w-full text-left py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  answers[currentQuestion.id] === opt
                    ? "border-[#4B4C6A] bg-[#eeedf2] text-[#4B4C6A]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === "TEXT" && (
          <textarea
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#4B4C6A] focus:outline-none resize-none"
            rows={3}
            placeholder="Type your answer..."
            value={(answers[currentQuestion.id] as string) || ""}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
          />
        )}

        {(currentQuestion.type === "NUMBER" || currentQuestion.type === "SALARY_INPUT") && (
          <div>
            {currentQuestion.type === "SALARY_INPUT" && (
              <p className="text-sm text-gray-500 mb-2">
                Enter your expected monthly salary
              </p>
            )}
            <input
              type="number"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#4B4C6A] focus:outline-none"
              placeholder={
                currentQuestion.type === "SALARY_INPUT"
                  ? "e.g. 5500"
                  : "Enter a number"
              }
              value={(answers[currentQuestion.id] as number) || ""}
              onChange={(e) =>
                handleAnswer(currentQuestion.id, Number(e.target.value))
              }
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-gray-500 font-medium disabled:opacity-30"
        >
          Back
        </button>

        {isLastStep ? (
          <button
            onClick={handleSubmit}
            disabled={!hasAnswer || submitting}
            className="flex items-center gap-2 px-6 py-2 bg-[#4B4C6A] text-white rounded-xl font-medium hover:bg-[#3e2666] disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Submit <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!hasAnswer}
            className="flex items-center gap-2 px-6 py-2 bg-[#4B4C6A] text-white rounded-xl font-medium hover:bg-[#3e2666] disabled:opacity-50 transition-colors"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
