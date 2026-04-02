"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mic, Video, FileText, CheckCircle2, XCircle, Clock, Star,
  Users, Clipboard, MessageCircle, ThumbsUp, ThumbsDown,
  ChevronDown, Plus, Play, Square, Loader2, AlertCircle,
  Brain, Target, Zap, BarChart3, Award, Globe, BookOpen
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

type InterviewType = "PHONE_SCREEN" | "LANGUAGE_TEST" | "TECHNICAL" | "BEHAVIORAL" | "FINAL";

interface QuestionSet {
  category: string;
  questions: { q: string; tips: string; scoreGuide: string }[];
}

const INTERVIEW_TYPES: { key: InterviewType; label: string; icon: any; color: string; duration: string; desc: string }[] = [
  { key: "PHONE_SCREEN", label: "Phone Screen", icon: Mic, color: "bg-blue-100 text-blue-700", duration: "15 min", desc: "Quick qualification check" },
  { key: "LANGUAGE_TEST", label: "Language Test", icon: Globe, color: "bg-purple-100 text-purple-700", duration: "20 min", desc: "Language proficiency assessment" },
  { key: "TECHNICAL", label: "Technical", icon: Brain, color: "bg-orange-100 text-orange-700", duration: "30 min", desc: "Skills & knowledge assessment" },
  { key: "BEHAVIORAL", label: "Behavioral", icon: Users, color: "bg-green-100 text-green-700", duration: "25 min", desc: "Culture & behavior assessment" },
  { key: "FINAL", label: "Final Interview", icon: Award, color: "bg-[#eeedf2] text-[#4B4C6A]", duration: "30 min", desc: "Final round with hiring manager" },
];

const QUESTION_BANK: Record<string, QuestionSet[]> = {
  PHONE_SCREEN: [
    {
      category: "Availability & Interest",
      questions: [
        { q: "Why are you interested in working at Teleperformance?", tips: "Listen for genuine interest vs. just needing a job. Good answers show research about the company.", scoreGuide: "5: Shows knowledge of TP, aligned values. 3: Generic interest. 1: No specific reason." },
        { q: "What is your availability to start? Can you commit to shift work?", tips: "BPO roles often require rotational shifts. Check for flexibility.", scoreGuide: "5: Immediate, fully flexible. 3: 2-week notice, some flexibility. 1: Many restrictions." },
        { q: "What are your salary expectations?", tips: "Compare with the role's salary band. Note if within GREEN tier range.", scoreGuide: "5: Within or below band. 3: At midpoint. 1: Above max." },
      ],
    },
    {
      category: "Experience Quick Check",
      questions: [
        { q: "Tell me briefly about your most recent work experience.", tips: "Focus on relevance to BPO/customer service. Note communication clarity.", scoreGuide: "5: Relevant BPO/CS exp. 3: Some transferable skills. 1: No relevant exp." },
        { q: "Have you worked in a call center or BPO environment before?", tips: "Prior BPO experience is a strong plus. Ask for details if yes.", scoreGuide: "5: 2+ years BPO. 3: Some contact center. 1: No experience." },
      ],
    },
  ],
  LANGUAGE_TEST: [
    {
      category: "Speaking Assessment",
      questions: [
        { q: "Please describe your typical day from morning to night.", tips: "Assess fluency, vocabulary range, and pronunciation. Note pauses and filler words.", scoreGuide: "5: Native-like fluency. 4: Fluent with minor errors. 3: Good with some pauses. 2: Limited vocabulary. 1: Difficult to understand." },
        { q: "Read this passage aloud: [provide passage about TP services]", tips: "Check pronunciation, reading speed, comprehension. Ask a follow-up question about content.", scoreGuide: "5: Clear pronunciation, good pace. 3: Understandable with effort. 1: Significant difficulties." },
        { q: "Role-play: You are a customer service agent. I'm calling about a billing issue.", tips: "Assess real-world language application. Note politeness, problem-solving communication.", scoreGuide: "5: Natural, professional, empathetic. 3: Functional but awkward. 1: Cannot maintain conversation." },
      ],
    },
    {
      category: "Comprehension",
      questions: [
        { q: "Listen carefully: [describe a customer scenario]. Now, tell me what the customer's main issue was.", tips: "Tests listening comprehension. Scenario should include 2-3 details.", scoreGuide: "5: Captures all details. 3: Gets main point. 1: Misses key information." },
        { q: "Write a brief email responding to a customer complaint about delayed delivery.", tips: "If testing writing, provide 5 minutes. Check grammar, tone, structure.", scoreGuide: "5: Professional, clear, empathetic. 3: Understandable. 1: Poor grammar, unclear." },
      ],
    },
  ],
  TECHNICAL: [
    {
      category: "Computer Skills",
      questions: [
        { q: "Walk me through how you would handle multiple applications open at once while on a call.", tips: "BPO agents need to navigate CRM, knowledge base, and chat simultaneously.", scoreGuide: "5: Describes multitasking effectively. 3: Basic understanding. 1: No computer comfort." },
        { q: "Have you used any CRM systems? Which ones?", tips: "Salesforce, Zendesk, Freshdesk, etc. Even basic tools count.", scoreGuide: "5: Multiple CRMs. 3: 1 CRM or similar. 1: Never used CRM." },
      ],
    },
    {
      category: "Problem Solving",
      questions: [
        { q: "A customer is extremely upset about being charged twice. Walk me through how you'd handle this.", tips: "Look for empathy → acknowledge → investigate → resolve → follow-up.", scoreGuide: "5: Complete structured approach. 3: Addresses issue but misses steps. 1: Gets flustered or dismissive." },
        { q: "You can't find the answer to a customer's question in your knowledge base. What do you do?", tips: "Good: escalate, ask team lead, put on hold properly. Bad: guess or hang up.", scoreGuide: "5: Clear escalation process. 3: Would try but uncertain. 1: Would guess or panic." },
      ],
    },
  ],
  BEHAVIORAL: [
    {
      category: "Customer Service Mindset",
      questions: [
        { q: "Tell me about a time you dealt with a difficult customer or person.", tips: "STAR method: Situation, Task, Action, Result. Look for empathy and resolution.", scoreGuide: "5: Clear STAR, positive outcome. 3: Reasonable approach. 1: Avoided or escalated badly." },
        { q: "How do you handle stress during high-volume periods?", tips: "BPO peaks can be intense. Look for coping strategies and resilience.", scoreGuide: "5: Specific strategies, positive attitude. 3: General awareness. 1: No strategies." },
      ],
    },
    {
      category: "Teamwork & Adaptability",
      questions: [
        { q: "Describe a time you had to adapt to a major change at work.", tips: "BPO has frequent process changes. Look for flexibility and positive attitude.", scoreGuide: "5: Embraced change, helped others adapt. 3: Adapted eventually. 1: Resistant to change." },
        { q: "How would you handle a situation where a colleague isn't pulling their weight?", tips: "Look for professional approach: direct communication, support, escalation if needed.", scoreGuide: "5: Constructive approach. 3: Would tolerate. 1: Would confront aggressively or ignore." },
      ],
    },
  ],
  FINAL: [
    {
      category: "Culture & Values Fit",
      questions: [
        { q: "What do you know about Teleperformance and our values?", tips: "Shows preparation. TP values: reliability, respect, creativity, commitment.", scoreGuide: "5: Researched, mentions values. 3: Basic awareness. 1: No knowledge." },
        { q: "Where do you see yourself in 2 years?", tips: "BPO career paths: team lead, QA, trainer, operations. Look for ambition + realism.", scoreGuide: "5: Clear growth plan in BPO. 3: Open to growing. 1: Just a temporary job." },
      ],
    },
    {
      category: "Final Assessment",
      questions: [
        { q: "Is there anything about this role or TP that concerns you?", tips: "Honest questions are good. Note deal-breakers (shift, location, etc.).", scoreGuide: "5: Thoughtful questions. 3: No concerns. 1: Many deal-breakers." },
        { q: "When would you be able to start if selected?", tips: "Confirm availability, notice period, any constraints.", scoreGuide: "5: Immediate. 3: 2 weeks. 1: 1+ month or uncertain." },
      ],
    },
  ],
};

interface ScoreEntry { questionIdx: number; score: number; notes: string }

export default function InterviewPage() {
  const [selectedType, setSelectedType] = useState<InterviewType>("PHONE_SCREEN");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [scores, setScores] = useState<Record<string, ScoreEntry[]>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [candidateName, setCandidateName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [showGuide, setShowGuide] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const questions = QUESTION_BANK[selectedType] || [];
  const allQuestions = questions.flatMap((qs, catIdx) =>
    qs.questions.map((q, qIdx) => ({ ...q, category: qs.category, catIdx, qIdx, globalIdx: 0 }))
  );
  let globalIdx = 0;
  allQuestions.forEach(q => { q.globalIdx = globalIdx++; });

  const totalQuestions = allQuestions.length;
  const answeredCount = Object.values(scores).flat().length;

  const setScore = (qGlobalIdx: number, score: number, notes: string = "") => {
    const key = `q-${qGlobalIdx}`;
    setScores(prev => ({
      ...prev,
      [key]: [{ questionIdx: qGlobalIdx, score, notes }],
    }));
  };

  const getScore = (qGlobalIdx: number) => {
    const key = `q-${qGlobalIdx}`;
    return scores[key]?.[0]?.score || 0;
  };

  const getNote = (qGlobalIdx: number) => {
    const key = `q-${qGlobalIdx}`;
    return scores[key]?.[0]?.notes || "";
  };

  const totalScore = Object.values(scores).flat().reduce((s, e) => s + e.score, 0);
  const maxScore = totalQuestions * 5;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const getRating = () => {
    if (percentage >= 80) return { label: "STRONG HIRE", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 60) return { label: "HIRE", color: "text-blue-600", bg: "bg-blue-50" };
    if (percentage >= 40) return { label: "MAYBE", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { label: "NO HIRE", color: "text-red-600", bg: "bg-red-50" };
  };

  // Timer
  useState(() => {
    if (timerActive) {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  });

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />
      {/* Header */}
      <div className="bg-[#4B4C6A] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Clipboard className="w-5 h-5" />
              <h1 className="text-lg font-bold">Smart Interview Assistant</h1>
            </div>
            <p className="text-xs text-white/60">Guided interviews with scoring, question bank & evaluation</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/ta-monitor" className="text-xs text-white/70 hover:text-white">TA Monitor</Link>
            <Link href="/admin" className="text-xs text-white/70 hover:text-white">Admin</Link>
            <Link href="/dashboard" className="text-xs text-white/70 hover:text-white">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {!interviewStarted ? (
          <>
            {/* Setup */}
            <div className="bg-white rounded-xl border border-[#e6e6e5] p-6 space-y-5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-800">Start New Interview</h2>
                <InfoTooltip text="Create a new interview session with candidate details and select the interview type matching their application stage" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Candidate Name *</label>
                  <input value={candidateName} onChange={e => setCandidateName(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" placeholder="Sarah Lim" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                  <input value={roleName} onChange={e => setRoleName(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" placeholder="CSR (Mandarin)" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Interview Type</label>
                  <InfoTooltip text="Select interview type: Phone Screen (quick qualification), Language Test, Technical (skills), Behavioral (culture fit), or Final (with hiring manager)" />
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {INTERVIEW_TYPES.map(t => (
                    <button key={t.key} onClick={() => setSelectedType(t.key)}
                      className={`p-4 rounded-xl border text-center transition ${selectedType === t.key
                        ? "border-[#4B4C6A] bg-[#4B4C6A]/5 ring-1 ring-[#4B4C6A]/20"
                        : "border-gray-200 hover:border-gray-300"}`}>
                      <div className={`w-10 h-10 rounded-lg ${t.color} flex items-center justify-center mx-auto mb-2`}>
                        <t.icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-gray-800">{t.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{t.duration}</p>
                      <p className="text-[10px] text-gray-400">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Preview */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 mb-2">Questions ({totalQuestions} total)</h3>
                <div className="space-y-2">
                  {questions.map((cat, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-3">
                      <p className="text-xs font-medium text-[#4B4C6A] mb-1">{cat.category}</p>
                      <ul className="space-y-0.5">
                        {cat.questions.map((q, j) => (
                          <li key={j} className="text-[11px] text-gray-600">• {q.q}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => { setInterviewStarted(true); setTimerActive(true); }}
                disabled={!candidateName}
                className="w-full flex items-center justify-center gap-2 bg-[#4B4C6A] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#3a3b54] transition disabled:opacity-50">
                <Play className="w-4 h-4" /> Start Interview
              </button>
            </div>
          </>
        ) : showSummary ? (
          /* Summary View */
          <div className="bg-white rounded-xl border border-[#e6e6e5] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">Interview Summary</h2>
              <span className="text-xs text-gray-400">Duration: {formatTime(timer)}</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Candidate</p>
                <p className="text-sm font-bold text-gray-800">{candidateName}</p>
                <p className="text-[10px] text-gray-400">{roleName}</p>
              </div>
              <div className={`text-center p-4 rounded-xl ${getRating().bg}`}>
                <p className="text-xs text-gray-500 mb-1">Recommendation</p>
                <p className={`text-lg font-bold ${getRating().color}`}>{getRating().label}</p>
                <p className="text-[10px] text-gray-500">{percentage}% score</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Score</p>
                <p className="text-2xl font-bold text-gray-800">{totalScore}/{maxScore}</p>
                <p className="text-[10px] text-gray-400">{answeredCount}/{totalQuestions} answered</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-700">Score by Category</h3>
              {questions.map((cat, catIdx) => {
                const catScore = cat.questions.reduce((s, _, qIdx) => {
                  const gIdx = allQuestions.find(q => q.catIdx === catIdx && q.qIdx === qIdx)?.globalIdx || 0;
                  return s + getScore(gIdx);
                }, 0);
                const catMax = cat.questions.length * 5;
                const catPct = Math.round((catScore / catMax) * 100);
                return (
                  <div key={catIdx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{cat.category}</span>
                      <span className="text-xs font-bold text-gray-800">{catScore}/{catMax} ({catPct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${catPct >= 70 ? "bg-green-500" : catPct >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${catPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Scores */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-700">Detailed Scores</h3>
              {allQuestions.map(q => {
                const score = getScore(q.globalIdx);
                const note = getNote(q.globalIdx);
                return (
                  <div key={q.globalIdx} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${score >= 4 ? "bg-green-100 text-green-700" : score >= 3 ? "bg-yellow-100 text-yellow-700" : score > 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-400"}`}>
                      {score || "—"}
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-gray-700">{q.q}</p>
                      {note && <p className="text-[10px] text-gray-500 mt-0.5 italic">Note: {note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowSummary(false); }}
                className="flex-1 flex items-center justify-center gap-2 text-sm border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition">
                ← Back to Questions
              </button>
              <button onClick={() => { setInterviewStarted(false); setShowSummary(false); setScores({}); setTimer(0); setTimerActive(false); setCandidateName(""); setRoleName(""); }}
                className="flex-1 flex items-center justify-center gap-2 text-sm bg-[#4B4C6A] text-white px-4 py-2.5 rounded-lg hover:bg-[#3a3b54] transition">
                <Plus className="w-4 h-4" /> New Interview
              </button>
            </div>
          </div>
        ) : (
          /* Interview In Progress */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Question Navigation */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-[#e6e6e5] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Interviewing</p>
                    <p className="text-sm font-bold text-gray-800">{candidateName}</p>
                    <p className="text-[10px] text-gray-400">{roleName} · {INTERVIEW_TYPES.find(t => t.key === selectedType)?.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-mono font-bold text-[#4B4C6A]">{formatTime(timer)}</p>
                    <p className="text-[10px] text-gray-400">{answeredCount}/{totalQuestions} scored</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[#4B4C6A] rounded-full transition-all" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} />
                </div>

                {/* Question List */}
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  {questions.map((cat, catIdx) => (
                    <div key={catIdx}>
                      <p className="text-[10px] font-semibold text-[#4B4C6A] mt-2 mb-1">{cat.category}</p>
                      {cat.questions.map((q, qIdx) => {
                        const gIdx = allQuestions.find(a => a.catIdx === catIdx && a.qIdx === qIdx)?.globalIdx || 0;
                        const score = getScore(gIdx);
                        return (
                          <button key={qIdx} onClick={() => setCurrentQ(gIdx)}
                            className={`w-full text-left text-[11px] px-2 py-1.5 rounded-lg transition flex items-center gap-2 ${currentQ === gIdx
                              ? "bg-[#4B4C6A] text-white"
                              : "text-gray-600 hover:bg-gray-100"}`}>
                            <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${score > 0
                              ? score >= 4 ? "bg-green-100 text-green-700" : score >= 3 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                              : currentQ === gIdx ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
                              {score || "·"}
                            </span>
                            <span className="truncate">{q.q.substring(0, 50)}...</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => { setTimerActive(false); setShowSummary(true); }}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                <CheckCircle2 className="w-4 h-4" /> End Interview & View Summary
              </button>
            </div>

            {/* Right: Current Question */}
            <div className="md:col-span-2 space-y-4">
              {allQuestions[currentQ] && (
                <>
                  <div className="bg-white rounded-xl border border-[#e6e6e5] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-medium text-[#4B4C6A] bg-[#4B4C6A]/10 px-2 py-0.5 rounded">
                        {allQuestions[currentQ].category}
                      </span>
                      <span className="text-xs text-gray-400">Q{currentQ + 1} of {totalQuestions}</span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-4">{allQuestions[currentQ].q}</h3>

                    {/* Interviewer Tips */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-[10px] font-medium text-blue-700 mb-1 flex items-center gap-1">
                        <Brain className="w-3 h-3" /> Interviewer Tip
                      </p>
                      <p className="text-xs text-blue-600">{allQuestions[currentQ].tips}</p>
                    </div>

                    {/* Scoring Guide */}
                    <button onClick={() => setShowGuide(showGuide === `q-${currentQ}` ? null : `q-${currentQ}`)}
                      className="text-[10px] text-[#4B4C6A] font-medium hover:underline flex items-center gap-1 mb-3">
                      <BookOpen className="w-3 h-3" /> {showGuide === `q-${currentQ}` ? "Hide" : "Show"} Scoring Guide
                    </button>
                    {showGuide === `q-${currentQ}` && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-600">{allQuestions[currentQ].scoreGuide}</p>
                      </div>
                    )}

                    {/* Score Buttons */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Score (1-5)</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => setScore(currentQ, s, getNote(currentQ))}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${getScore(currentQ) === s
                              ? s >= 4 ? "bg-green-500 text-white" : s >= 3 ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                        <span>Poor</span>
                        <span>Below Average</span>
                        <span>Average</span>
                        <span>Good</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Notes</label>
                      <textarea value={getNote(currentQ)} onChange={e => setScore(currentQ, getScore(currentQ) || 3, e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 h-20 resize-none"
                        placeholder="Candidate's response notes..." />
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3">
                    <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
                      className="flex-1 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-30">
                      ← Previous
                    </button>
                    <button onClick={() => setCurrentQ(Math.min(totalQuestions - 1, currentQ + 1))} disabled={currentQ === totalQuestions - 1}
                      className="flex-1 text-sm bg-[#4B4C6A] text-white px-4 py-2 rounded-lg hover:bg-[#3a3b54] transition disabled:opacity-30">
                      Next →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
