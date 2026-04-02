"use client";

import { Calendar, Video, Clock, Users } from "lucide-react";
import { format } from "date-fns";

interface Props {
  candidateId: string;
  interviewMode: string;
  scheduledAt: Date | null;
  stage: string;
}

export default function InterviewStage({
  candidateId,
  interviewMode,
  scheduledAt,
  stage,
}: Props) {
  // AI Interview mode
  if (interviewMode === "AI_INTERVIEW") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Video Interview
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          You&apos;ll be asked a series of questions on camera. Take your time,
          speak naturally, and be yourself. There are no right or wrong
          answers — we&apos;re looking for how you think and communicate.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 max-w-sm mx-auto mb-6 text-left">
          <h4 className="font-semibold text-gray-700 mb-2">What to expect:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• 5-6 scenario-based questions</li>
            <li>• 2 minutes per question to record your answer</li>
            <li>• Total time: approximately 15 minutes</li>
            <li>• You can re-record each answer once</li>
          </ul>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors">
          Start Video Interview <Video className="w-4 h-4" />
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Make sure your camera and microphone are working before starting.
        </p>
      </div>
    );
  }

  // Human interview — scheduled
  if (scheduledAt) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Interview Scheduled
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-sm mx-auto mb-6">
          <p className="text-blue-800 font-semibold">
            {format(new Date(scheduledAt), "EEEE, MMMM d, yyyy")}
          </p>
          <p className="text-blue-600">
            {format(new Date(scheduledAt), "h:mm a")} (30 minutes)
          </p>
        </div>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          You&apos;ll meet with a member of our Operations team. They&apos;ll
          ask about your experience and how you handle different customer
          scenarios.
        </p>
      </div>
    );
  }

  // Human interview — needs to schedule
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Schedule Your Interview
      </h2>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Excellent work on the assessment! The next step is a 30-minute
        interview with our Operations team. Please pick a time that works for
        you.
      </p>
      {/* TODO: Embed actual booking scheduler (Calendly, Cal.com, or custom) */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 max-w-md mx-auto">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">
          Booking scheduler will be embedded here.
          <br />
          (Calendly / Cal.com / TP Client scheduler)
        </p>
      </div>
    </div>
  );
}
