"use client";

import { useState, useEffect } from "react";
import {
  Calendar, Clock, Video, MapPin, CheckCircle2, AlertCircle, MessageCircle,
  ChevronRight, BookOpen, Lightbulb, Users, Brain, HelpCircle
} from "lucide-react";

export default function InterviewCandidateView() {
  const [checklist, setChecklist] = useState([
    { id: "1", label: "Review the job description", checked: false },
    { id: "2", label: "Prepare your self-introduction (2 minutes)", checked: false },
    { id: "3", label: "Have examples of customer service situations ready", checked: false },
    { id: "4", label: "Test your camera and microphone", checked: false },
    { id: "5", label: "Find a quiet, well-lit location", checked: false },
    { id: "6", label: "Have a glass of water nearby", checked: false },
    { id: "7", label: "Dress professionally (business casual)", checked: false },
    { id: "8", label: "Keep your CV/resume handy", checked: false },
  ]);

  const [countdown, setCountdown] = useState({ hours: 14, minutes: 23, seconds: 45 });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
          if (minutes < 0) {
            minutes = 59;
            hours -= 1;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checklistProgress = Math.round(
    (checklist.filter((item) => item.checked).length / checklist.length) * 100
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header Gradient */}
      <div className="bg-gradient-to-r from-[#4B4C6A] to-[#3E2666] text-white py-12 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Interview</h1>
            <p className="text-white/80">Get ready for success</p>
          </div>
          <img src="/tp-logo-white.png" alt="TP" className="h-12 w-auto opacity-90" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Interview Details Card */}
        <div className="bg-gradient-to-br from-[#f8f7f5] to-[#ECE9E7] rounded-xl p-8 border border-[#E6E6E5] mb-12">
          <h2 className="text-2xl font-bold text-[#4B4C6A] mb-6 flex items-center gap-2">
            <Calendar size={28} className="text-[#FF0082]" />
            Interview Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <p className="text-[#848DAD] text-sm font-semibold mb-1">POSITION</p>
                <p className="text-[#4B4C6A] font-bold text-lg">CSR (Mandarin) - Tech Giant</p>
              </div>
              <div className="mb-6">
                <p className="text-[#848DAD] text-sm font-semibold mb-1 flex items-center gap-1">
                  <Calendar size={16} />
                  INTERVIEW DATE & TIME
                </p>
                <p className="text-[#4B4C6A] font-bold text-lg">March 27, 2026 at 10:00 AM (MYT)</p>
              </div>
              <div className="mb-6">
                <p className="text-[#848DAD] text-sm font-semibold mb-1 flex items-center gap-1">
                  <Video size={16} />
                  INTERVIEW TYPE
                </p>
                <p className="text-[#4B4C6A] font-bold text-lg">Video Call (Google Meet)</p>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <p className="text-[#848DAD] text-sm font-semibold mb-1 flex items-center gap-1">
                  <Clock size={16} />
                  DURATION
                </p>
                <p className="text-[#4B4C6A] font-bold text-lg">45 minutes</p>
              </div>
              <div className="mb-6">
                <p className="text-[#848DAD] text-sm font-semibold mb-1">INTERVIEWER</p>
                <p className="text-[#4B4C6A] font-bold text-lg">Operations Team</p>
              </div>
              <div className="mb-6">
                <p className="text-[#848DAD] text-sm font-semibold mb-1 flex items-center gap-1">
                  <MapPin size={16} />
                  LOCATION
                </p>
                <p className="text-[#4B4C6A] font-bold text-lg">Online (link will be shared 30 mins before)</p>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-8 pt-8 border-t border-[#C2C7CD] flex items-center justify-between">
            <div>
              <p className="text-[#848DAD] text-sm font-semibold mb-2">INTERVIEW STARTS IN</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#FF0082]">
                  {String(countdown.hours).padStart(2, "0")}
                </span>
                <span className="text-[#676767] font-semibold">h</span>
                <span className="text-4xl font-bold text-[#FF0082] ml-2">
                  {String(countdown.minutes).padStart(2, "0")}
                </span>
                <span className="text-[#676767] font-semibold">m</span>
                <span className="text-4xl font-bold text-[#FF0082] ml-2">
                  {String(countdown.seconds).padStart(2, "0")}
                </span>
                <span className="text-[#676767] font-semibold">s</span>
              </div>
            </div>
            <AlertCircle size={48} className="text-[#FF0082]" />
          </div>
        </div>

        {/* Preparation Checklist */}
        <div className="bg-white rounded-xl p-8 border border-[#E6E6E5] mb-12 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#4B4C6A] flex items-center gap-2">
              <CheckCircle2 size={28} className="text-[#4B4C6A]" />
              Preparation Checklist
            </h2>
            <div className="text-right">
              <p className="text-[#848DAD] text-sm">Progress</p>
              <p className="text-2xl font-bold text-[#FF0082]">{checklistProgress}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#ECE9E7] rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF0082] to-[#4B4C6A] transition-all duration-300"
              style={{ width: `${checklistProgress}%` }}
            />
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklist.map((item) => (
              <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f8f7f5] cursor-pointer transition-colors">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    item.checked
                      ? "bg-[#FF0082] border-[#FF0082]"
                      : "border-[#C2C7CD] hover:border-[#FF0082]"
                  }`}
                >
                  {item.checked && <CheckCircle2 size={16} className="text-white" />}
                </div>
                <span className={`text-[#414141] ${item.checked ? "line-through text-[#848DAD]" : ""}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#4B4C6A] mb-6 flex items-center gap-2">
            <Lightbulb size={28} className="text-[#FF0082]" />
            Interview Tips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tip 1: Communication */}
            <div className="bg-white rounded-xl p-6 border border-[#E6E6E5] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#ECE9E7] rounded-lg flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-[#FF0082]" />
              </div>
              <h3 className="text-lg font-bold text-[#4B4C6A] mb-3">Communication</h3>
              <p className="text-[#676767] leading-relaxed">
                Speak clearly and at a moderate pace. The interviewer will assess your language skills and how well you can explain concepts.
              </p>
            </div>

            {/* Tip 2: STAR Method */}
            <div className="bg-white rounded-xl p-6 border border-[#E6E6E5] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#ECE9E7] rounded-lg flex items-center justify-center mb-4">
                <Brain size={24} className="text-[#FF0082]" />
              </div>
              <h3 className="text-lg font-bold text-[#4B4C6A] mb-3">STAR Method</h3>
              <p className="text-[#676767] leading-relaxed">
                Structure your answers: Situation, Task, Action, Result. This shows clear thinking and helps you provide comprehensive responses.
              </p>
            </div>

            {/* Tip 3: Be Authentic */}
            <div className="bg-white rounded-xl p-6 border border-[#E6E6E5] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#ECE9E7] rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-[#FF0082]" />
              </div>
              <h3 className="text-lg font-bold text-[#4B4C6A] mb-3">Be Authentic</h3>
              <p className="text-[#676767] leading-relaxed">
                We value genuine responses. It's okay to take a moment to think before answering. Authenticity resonates more than perfect answers.
              </p>
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div className="bg-[#f8f7f5] rounded-xl p-8 border border-[#E6E6E5] mb-12">
          <h2 className="text-2xl font-bold text-[#4B4C6A] mb-8 flex items-center gap-2">
            <BookOpen size={28} className="text-[#FF0082]" />
            What to Expect
          </h2>

          <div className="space-y-4">
            {[
              { step: 1, title: "Welcome & Introduction", duration: "5 min", desc: "The interviewer will greet you and give a brief overview of the interview structure." },
              { step: 2, title: "Behavioral Questions", duration: "15 min", desc: "You'll be asked about your experience, work style, and how you handle different situations." },
              { step: 3, title: "Role-play Scenario", duration: "10 min", desc: "Participate in a realistic customer service scenario to demonstrate your skills." },
              { step: 4, title: "Technical/System Questions", duration: "10 min", desc: "Questions about product knowledge, CRM systems, or other technical aspects of the role." },
              { step: 5, title: "Your Questions for Us", duration: "5 min", desc: "You'll have the opportunity to ask the interviewer any questions about the role or company." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#FF0082] text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-[#4B4C6A]">{item.title}</h3>
                    <span className="text-sm font-semibold text-[#FF0082] flex items-center gap-1">
                      <Clock size={14} />
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-[#676767]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#ECE9E7] rounded-xl p-6 border border-[#C2C7CD]">
          <div className="text-center md:text-left">
            <p className="text-[#676767] mb-1">Need to make changes?</p>
            <button className="text-[#FF0082] font-semibold hover:underline flex items-center gap-1 mx-auto md:mx-0">
              <HelpCircle size={16} />
              Reschedule Interview
            </button>
          </div>

          <button className="px-8 py-3 bg-[#4B4C6A] text-white rounded-lg font-semibold hover:bg-[#3E2666] transition-colors flex items-center gap-2">
            Contact Recruiter
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#f8f7f5] mt-16 px-6 py-8 text-center border-t border-[#E6E6E5]">
        <p className="text-[#848DAD] text-sm">
          Good luck with your interview! We're excited to meet you.
        </p>
      </div>
    </div>
  );
}
