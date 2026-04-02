"use client";

import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";

interface Stage {
  id: string;
  label: string;
}

interface Props {
  stages: Stage[];
  currentStage: string;
}

export default function ProgressTracker({ stages, currentStage }: Props) {
  const currentIndex = stages.findIndex((s) => s.id === currentStage);
  const isRejected = currentStage === "rejected";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Your Progress
      </h3>
      <div className="space-y-1">
        {stages.map((stage, index) => {
          let status: "completed" | "active" | "pending" | "failed";

          if (isRejected) {
            status = index < currentIndex ? "completed" : index === currentIndex ? "failed" : "pending";
          } else if (index < currentIndex) {
            status = "completed";
          } else if (index === currentIndex) {
            status = "active";
          } else {
            status = "pending";
          }

          return (
            <div
              key={stage.id}
              className={`progress-step ${status}`}
            >
              <div className="flex-shrink-0">
                {status === "completed" && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {status === "active" && (
                  <Loader2 className="w-5 h-5 text-[#4B4C6A] animate-spin" />
                )}
                {status === "pending" && (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                {status === "failed" && (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  status === "completed"
                    ? "text-green-700"
                    : status === "active"
                      ? "text-[#4B4C6A]"
                      : status === "failed"
                        ? "text-red-600"
                        : "text-gray-400"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
