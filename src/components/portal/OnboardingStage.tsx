"use client";

import { CheckCircle2, Upload, FileCheck, AlertCircle } from "lucide-react";

interface Props {
  candidateId: string;
  stage: string;
}

export default function OnboardingStage({ candidateId, stage }: Props) {
  const tasks = [
    {
      id: "offer",
      label: "Offer accepted",
      status: "completed" as const,
      icon: CheckCircle2,
    },
    {
      id: "documents",
      label: "Upload personal documents",
      status: "active" as const,
      icon: Upload,
      description:
        "Upload your ID, educational certificates, and employment references.",
    },
    {
      id: "bgv",
      label: "Background verification",
      status: "pending" as const,
      icon: FileCheck,
      description: "We'll run a background check once documents are received.",
    },
    {
      id: "visa",
      label: "Visa & travel arrangements",
      status: "pending" as const,
      icon: FileCheck,
      description: "If applicable, visa processing and flight booking.",
    },
    {
      id: "start",
      label: "Day one onboarding",
      status: "pending" as const,
      icon: CheckCircle2,
      description: "Welcome session, equipment setup, and team introduction.",
    },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to the Team!
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Here&apos;s what you need to complete before your start date. We&apos;ll
          guide you through each step.
        </p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border-2 ${
                task.status === "completed"
                  ? "border-green-200 bg-green-50"
                  : task.status === "active"
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 ${
                    task.status === "completed"
                      ? "text-green-500"
                      : task.status === "active"
                        ? "text-blue-600"
                        : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    task.status === "completed"
                      ? "text-green-700"
                      : task.status === "active"
                        ? "text-blue-700"
                        : "text-gray-500"
                  }`}
                >
                  {task.label}
                </span>
                {task.status === "completed" && (
                  <span className="ml-auto text-xs text-green-600 font-medium">
                    Done
                  </span>
                )}
              </div>
              {task.description && task.status !== "completed" && (
                <p className="text-sm text-gray-500 mt-1 ml-8">
                  {task.description}
                </p>
              )}
              {task.status === "active" && (
                <div className="mt-3 ml-8">
                  {/* TODO: Real document upload component */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                    <p className="text-sm text-blue-600">
                      Click or drag files to upload
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, JPG, PNG (max 10MB each)
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
