"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";
import {
  ChevronDown, ChevronUp, Star, Play, Pause, RotateCcw, Check, X,
  MessageSquare, AlertCircle
} from "lucide-react";

interface EvaluationSection {
  id: string;
  title: string;
  weight: number;
  items: {
    label: string;
    rating: number;
  }[];
}

interface Question {
  id: string;
  text: string;
  asked: boolean;
}

interface RedFlag {
  id: string;
  label: string;
  checked: boolean;
}

export default function InterviewOpsScorecard() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("communication");
  const [notes, setNotes] = useState("");
  const [verdict, setVerdict] = useState<"PASS" | "FAIL" | "HOLD" | null>(null);
  const [questions, setQuestions] = useState<Question[]>([
    { id: "q1", text: "Describe a time you handled an angry customer", asked: false },
    { id: "q2", text: "How would you explain a billing discrepancy to a confused caller?", asked: false },
    { id: "q3", text: "Walk me through your typical troubleshooting process", asked: false },
    { id: "q4", text: "What does good customer service mean to you?", asked: false },
    { id: "q5", text: "How do you handle multiple tasks simultaneously?", asked: false },
    { id: "q6", text: "Describe your experience with CRM systems", asked: false },
    { id: "q7", text: "Role-play: Customer wants to cancel their subscription", asked: false },
    { id: "q8", text: "Tell me about a time you went above and beyond", asked: false },
  ]);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([
    { id: "f1", label: "Couldn't explain work gaps", checked: false },
    { id: "f2", label: "Negative about previous employer", checked: false },
    { id: "f3", label: "Salary expectations unrealistic", checked: false },
    { id: "f4", label: "Poor communication skills", checked: false },
    { id: "f5", label: "Late to interview", checked: false },
    { id: "f6", label: "Inconsistent with CV", checked: false },
  ]);
  const [evaluations, setEvaluations] = useState<EvaluationSection[]>([
    {
      id: "communication",
      title: "Communication Skills",
      weight: 25,
      items: [
        { label: "Clarity of speech", rating: 0 },
        { label: "Active listening", rating: 0 },
        { label: "Language proficiency", rating: 0 },
      ],
    },
    {
      id: "technical",
      title: "Technical Knowledge",
      weight: 20,
      items: [
        { label: "Product/service knowledge", rating: 0 },
        { label: "Problem-solving approach", rating: 0 },
        { label: "System navigation skills", rating: 0 },
      ],
    },
    {
      id: "customer",
      title: "Customer Handling",
      weight: 30,
      items: [
        { label: "Empathy & rapport", rating: 0 },
        { label: "Conflict resolution", rating: 0 },
        { label: "Patience under pressure", rating: 0 },
      ],
    },
    {
      id: "cultural",
      title: "Cultural Fit",
      weight: 15,
      items: [
        { label: "Team orientation", rating: 0 },
        { label: "Adaptability", rating: 0 },
      ],
    },
    {
      id: "motivation",
      title: "Motivation & Availability",
      weight: 10,
      items: [
        { label: "Interest in role", rating: 0 },
        { label: "Schedule flexibility", rating: 0 },
      ],
    },
  ]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const updateRating = (sectionId: string, itemIndex: number, rating: number) => {
    setEvaluations((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? { ...sec, items: sec.items.map((item, idx) => (idx === itemIndex ? { ...item, rating } : item)) }
          : sec
      )
    );
  };

  const toggleQuestion = (id: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, asked: !q.asked } : q)));
  };

  const toggleRedFlag = (id: string) => {
    setRedFlags((prev) => prev.map((f) => (f.id === id ? { ...f, checked: !f.checked } : f)));
  };

  const calculateOverallScore = () => {
    const scores = evaluations.map((sec) => {
      const avgRating = sec.items.length > 0 ? sec.items.reduce((sum, item) => sum + item.rating, 0) / sec.items.length : 0;
      return (avgRating / 5) * (sec.weight / 100);
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) * 100);
  };

  const overallScore = calculateOverallScore();

  return (
    <div className="flex min-h-screen bg-[#f8f7f5]">
      <Navbar />

      <div className="flex-1 lg:pl-[240px]">
        {/* Header */}
        <div className="bg-white border-b border-[#E6E6E5] px-8 py-6">
          <h1 className="text-3xl font-bold text-[#4B4C6A] mb-1">Interview Scorecard</h1>
          <p className="text-[#676767]">Operations Team</p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column: Active Interview Panel (60%) */}
            <div className="col-span-2 space-y-6">
              {/* Candidate Info Card */}
              <div className="bg-white rounded-lg border border-[#E6E6E5] p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#4B4C6A] text-white flex items-center justify-center text-xl font-bold">
                    SL
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#4B4C6A]">Sarah Lim Wei Ling</h2>
                    <p className="text-[#676767] mb-3">CSR (Mandarin) • Tech Giant</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-[#848DAD]">Applied Date:</span>
                        <p className="text-[#414141] font-medium">Mar 18, 2026</p>
                      </div>
                      <div>
                        <span className="text-[#848DAD]">Source:</span>
                        <p className="text-[#414141] font-medium">JobStreet</p>
                      </div>
                      <div>
                        <span className="text-[#848DAD]">CV Score:</span>
                        <p className="text-[#414141] font-medium">82</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Timer */}
              <div className="bg-white rounded-lg border border-[#E6E6E5] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#4B4C6A] mb-4 flex items-center gap-2">
                  Interview Timer
                  <InfoTooltip text="Start the timer when the interview begins. You can pause, resume, or reset as needed." />
                </h3>
                <div className="text-5xl font-bold text-[#FF0082] text-center mb-6 font-mono">
                  {formatTime(time)}
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4B4C6A] text-white rounded-lg hover:bg-[#3E2666] transition-colors"
                  >
                    {isRunning ? <Pause size={18} /> : <Play size={18} />}
                    {isRunning ? "Pause" : "Start"}
                  </button>
                  <button
                    onClick={() => { setTime(0); setIsRunning(false); }}
                    className="flex items-center gap-2 px-4 py-2 border border-[#C2C7CD] text-[#414141] rounded-lg hover:bg-[#ECE9E7] transition-colors"
                  >
                    <RotateCcw size={18} />
                    Reset
                  </button>
                </div>
              </div>

              {/* Evaluation Sections */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#4B4C6A] flex items-center gap-2">
                  Evaluation Sections
                  <InfoTooltip text="Rate each criterion on a 1-5 scale. The overall score is weighted by category importance." />
                </h3>
                {evaluations.map((section) => (
                  <div key={section.id} className="bg-white rounded-lg border border-[#E6E6E5] overflow-hidden shadow-sm">
                    <button
                      onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#ECE9E7] transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-[#4B4C6A] font-semibold">{section.title}</span>
                        <span className="text-[#848DAD] text-sm">(Weight: {section.weight}%)</span>
                      </div>
                      {expandedSection === section.id ? <ChevronUp size={20} className="text-[#676767]" /> : <ChevronDown size={20} className="text-[#676767]" />}
                    </button>

                    {expandedSection === section.id && (
                      <div className="px-6 py-4 border-t border-[#E6E6E5] space-y-4">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-[#414141] font-medium">{item.label}</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => updateRating(section.id, idx, star)}
                                  className="transition-transform hover:scale-110"
                                >
                                  <Star
                                    size={24}
                                    className={star <= item.rating ? "fill-[#FF0082] text-[#FF0082]" : "text-[#C2C7CD]"}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="bg-white rounded-lg border border-[#E6E6E5] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#4B4C6A] mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Interview Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Capture key observations, strengths, concerns, and follow-up items..."
                  className="w-full h-32 p-4 border border-[#E6E6E5] rounded-lg text-[#414141] placeholder-[#848DAD] focus:outline-none focus:ring-2 focus:ring-[#FF0082] resize-none"
                />
              </div>
            </div>

            {/* Right Column: Quick Reference (40%) */}
            <div className="col-span-1 space-y-6">
              {/* Suggested Questions */}
              <div className="bg-white rounded-lg border border-[#E6E6E5] p-6 shadow-sm sticky top-8">
                <h3 className="text-lg font-semibold text-[#4B4C6A] mb-4 flex items-center gap-2">
                  Suggested Questions
                  <InfoTooltip text="Questions tailored for CSR evaluation. Check off as you ask them." position="left" />
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {questions.map((q) => (
                    <div key={q.id} className="flex items-start gap-2">
                      <button
                        onClick={() => toggleQuestion(q.id)}
                        className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors ${
                          q.asked
                            ? "bg-[#FF0082] border-[#FF0082]"
                            : "border-[#C2C7CD] hover:border-[#FF0082]"
                        }`}
                      >
                        {q.asked && <Check size={14} className="text-white" />}
                      </button>
                      <span className={`text-sm ${q.asked ? "text-[#848DAD] line-through" : "text-[#414141]"}`}>
                        {q.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags */}
              <div className="bg-white rounded-lg border border-[#E6E6E5] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#4B4C6A] mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-[#FF0082]" />
                  Red Flags
                </h3>
                <div className="space-y-3">
                  {redFlags.map((flag) => (
                    <label key={flag.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flag.checked}
                        onChange={() => toggleRedFlag(flag.id)}
                        className="w-4 h-4 rounded border-[#C2C7CD] cursor-pointer accent-[#FF0082]"
                      />
                      <span className="text-sm text-[#414141]">{flag.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verdict */}
              <div className="bg-white rounded-lg border border-[#E6E6E5] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#4B4C6A] mb-4">Verdict</h3>

                <div className="mb-6 p-4 bg-[#ECE9E7] rounded-lg text-center">
                  <p className="text-[#848DAD] text-sm mb-1">Overall Score</p>
                  <p className="text-4xl font-bold text-[#4B4C6A]">{overallScore}%</p>
                </div>

                <div className="mb-6 space-y-3">
                  <p className="text-sm font-semibold text-[#414141]">Recommendation</p>
                  <div className="space-y-2">
                    {["PASS", "FAIL", "HOLD"].map((option) => (
                      <button
                        key={option}
                        onClick={() => setVerdict(option as "PASS" | "FAIL" | "HOLD")}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                          verdict === option
                            ? "bg-[#4B4C6A] text-white shadow-md"
                            : "bg-[#ECE9E7] text-[#414141] hover:bg-[#C2C7CD]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="w-full px-4 py-3 bg-[#FF0082] text-white rounded-lg font-semibold hover:bg-[#E60073] transition-colors">
                  Submit Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
