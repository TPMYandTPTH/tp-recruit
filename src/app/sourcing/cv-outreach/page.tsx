"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText, Search, CheckCircle2, XCircle, AlertTriangle, Loader2,
  Send, Copy, ChevronDown, Globe, Mail, MessageCircle, Linkedin,
  Phone, Sparkles, BarChart3, User, Briefcase, GraduationCap,
  Code, Languages, Award, Target
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

type ValidationLevel = "EASY" | "MEDIUM" | "HARD";

export default function CVOutreachPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"validate" | "outreach">("validate");

  // CV Validation state
  const [cvText, setCvText] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [validationLevel, setValidationLevel] = useState<ValidationLevel>("MEDIUM");
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  // Outreach state
  const [outreachForm, setOutreachForm] = useState({
    candidateName: "", roleTitle: "", client: "Teleperformance Malaysia",
    language: "EN", channel: "email", tone: "professional", cvScore: 0,
  });
  const [generating, setGenerating] = useState(false);
  const [outreachResult, setOutreachResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/roles").then(r => r.json()).then(d => setRoles(d.roles || []));
  }, []);

  const handleValidate = async () => {
    setValidating(true);
    setValidationResult(null);
    try {
      const res = await fetch("/api/cv-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, roleId: selectedRoleId || undefined, level: validationLevel }),
      });
      const data = await res.json();
      setValidationResult(data);

      // Auto-fill outreach with score
      if (data.score) {
        setOutreachForm(f => ({ ...f, cvScore: data.score }));
      }
    } catch (e) {
      console.error(e);
    }
    setValidating(false);
  };

  const handleGenerateOutreach = async () => {
    setGenerating(true);
    setOutreachResult(null);
    try {
      const res = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outreachForm),
      });
      const data = await res.json();
      setOutreachResult(data.messages);
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const sampleCV = `RESUME — Sarah Lim Wei Ling

Contact: sarah.lim@email.com | +60 12-345 6789 | Kuala Lumpur, Malaysia

LANGUAGES: English (Fluent), Mandarin (Native), Bahasa Malaysia (Conversational)

EDUCATION:
Bachelor of Business Administration — INTI International University (2020-2024)
SPM — 7A's (2019)

EXPERIENCE:
Customer Service Executive — TDCX Malaysia (Jan 2024 - Present)
• Handle inbound customer queries for a global tech client via phone, email, and chat
• Achieved 95% customer satisfaction score consistently
• Process 80+ interactions daily with average handling time of 4.5 minutes
• Trained 5 new team members on CRM systems and SOPs

Intern — Contact Center — Concentrix (Jun 2023 - Dec 2023)
• Assisted senior agents with customer escalations
• Learned Zendesk, Salesforce CRM, and ticketing systems
• Participated in quality assurance reviews

SKILLS:
• Communication, Problem Solving, Teamwork, Time Management, Multitask
• Microsoft Office (Excel, Word, PowerPoint), CRM Systems
• Typing speed: 65 WPM
• Customer service, Call center operations, BPO industry knowledge

CERTIFICATIONS:
• Google Digital Marketing Certificate (2024)
• IELTS Band 7.5`;

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />
      {/* Header */}
      <div className="bg-[#4B4C6A] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <FileText className="w-5 h-5" />
              <h1 className="text-lg font-bold">CV Validation & Outreach</h1>
            </div>
            <p className="text-xs text-white/60">Validate CVs against job descriptions & generate outreach messages</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sourcing" className="text-xs text-white/70 hover:text-white">← Sourcing Hub</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-lg border border-[#e6e6e5] p-1 w-fit">
          <button onClick={() => setActiveTab("validate")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === "validate" ? "bg-[#4B4C6A] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            <Target className="w-4 h-4" /> CV Validation
          </button>
          <button onClick={() => setActiveTab("outreach")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === "outreach" ? "bg-[#4B4C6A] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            <Send className="w-4 h-4" /> Outreach Generator
          </button>
        </div>

        {activeTab === "validate" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Input */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-[#e6e6e5] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-800">CV / Resume Text</h2>
                    <InfoTooltip text="Paste CV text to analyze candidate qualifications, experience, languages, and skills against job requirements" />
                  </div>
                  <button onClick={() => setCvText(sampleCV)} className="text-[10px] text-[#4B4C6A] font-medium hover:underline">
                    Load sample CV
                  </button>
                </div>
                <textarea value={cvText} onChange={e => setCvText(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 h-64 resize-none font-mono"
                  placeholder="Paste CV text here..." />

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Match Against Role (optional)</label>
                  <select value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                    <option value="">General BPO/CS assessment</option>
                    {roles.map((r: any) => <option key={r.id} value={r.id}>{r.title} — {r.client}</option>)}
                  </select>
                </div>

                {/* Validation Level */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Validation Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { level: "EASY" as ValidationLevel, label: "Easy", desc: "Language check only", color: "bg-green-50 border-green-200 text-green-700" },
                      { level: "MEDIUM" as ValidationLevel, label: "Medium", desc: "Partial JD match", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
                      { level: "HARD" as ValidationLevel, label: "Hard", desc: "Full match scoring", color: "bg-red-50 border-red-200 text-red-700" },
                    ]).map(v => (
                      <button key={v.level} onClick={() => setValidationLevel(v.level)}
                        className={`p-3 rounded-lg border text-center transition ${validationLevel === v.level
                          ? `${v.color} border-2`
                          : "border-gray-200 hover:border-gray-300"}`}>
                        <p className="text-xs font-bold">{v.label}</p>
                        <p className="text-[10px] text-gray-500">{v.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleValidate} disabled={!cvText.trim() || validating}
                  className="w-full flex items-center justify-center gap-2 bg-[#4B4C6A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#3a3b54] transition disabled:opacity-50">
                  {validating ? <><Loader2 className="w-4 h-4 animate-spin" /> Validating...</> : <><Search className="w-4 h-4" /> Validate CV</>}
                </button>
              </div>
            </div>

            {/* Right: Results */}
            <div className="space-y-4">
              {!validationResult ? (
                <div className="bg-white rounded-xl border border-[#e6e6e5] p-12 text-center">
                  <Target className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Validation results will appear here</p>
                  <p className="text-xs text-gray-400 mt-1">Paste a CV and click Validate</p>
                </div>
              ) : (
                <>
                  {/* Score Card */}
                  <div className={`rounded-xl border-2 p-5 ${validationResult.pass
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {validationResult.pass
                          ? <CheckCircle2 className="w-6 h-6 text-green-600" />
                          : <XCircle className="w-6 h-6 text-red-600" />}
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {validationResult.pass ? "PASS" : "FAIL"}
                            {validationResult.rating && ` — ${validationResult.rating}`}
                          </p>
                          <p className="text-xs text-gray-500">Level: {validationResult.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900">{validationResult.score}</p>
                        <p className="text-xs text-gray-500">{validationResult.level === "EASY" ? "/ 100" : "/ 100"}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{validationResult.summary}</p>
                  </div>

                  {/* EASY: Languages */}
                  {validationResult.level === "EASY" && validationResult.detectedLanguages && (
                    <div className="bg-white rounded-xl border border-[#e6e6e5] p-5">
                      <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Languages className="w-4 h-4" /> Detected Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {validationResult.detectedLanguages.map((l: string) => (
                          <span key={l} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{l}</span>
                        ))}
                      </div>
                      {validationResult.requiredLanguage && (
                        <p className="text-xs text-gray-500 mt-2">Required: {validationResult.requiredLanguage}</p>
                      )}
                    </div>
                  )}

                  {/* MEDIUM: Keywords */}
                  {validationResult.level === "MEDIUM" && (
                    <div className="bg-white rounded-xl border border-[#e6e6e5] p-5 space-y-3">
                      <h3 className="text-xs font-semibold text-gray-700">Keyword Match</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-green-600 font-medium mb-1">Matched ({validationResult.matchedKeywords?.length || 0})</p>
                          <div className="flex flex-wrap gap-1">
                            {(validationResult.matchedKeywords || []).map((k: string) => (
                              <span key={k} className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[10px]">{k}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-red-600 font-medium mb-1">Missing ({validationResult.missingKeywords?.length || 0})</p>
                          <div className="flex flex-wrap gap-1">
                            {(validationResult.missingKeywords || []).map((k: string) => (
                              <span key={k} className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px]">{k}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-800">{validationResult.yearsExperience || 0}</p>
                          <p className="text-[10px] text-gray-500">Years Exp</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-800">{validationResult.hasEducation ? "✓" : "✗"}</p>
                          <p className="text-[10px] text-gray-500">Education</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-800">{validationResult.industryMatch?.length || 0}</p>
                          <p className="text-[10px] text-gray-500">BPO Keywords</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* HARD: Full Breakdown */}
                  {validationResult.level === "HARD" && validationResult.breakdown && (
                    <div className="bg-white rounded-xl border border-[#e6e6e5] p-5 space-y-3">
                      <h3 className="text-xs font-semibold text-gray-700">Score Breakdown</h3>
                      {[
                        { key: "keywords", label: "Keywords", icon: Target, max: 30, color: "bg-blue-500" },
                        { key: "experience", label: "Experience", icon: Briefcase, max: 20, color: "bg-purple-500" },
                        { key: "softSkills", label: "Soft Skills", icon: User, max: 15, color: "bg-green-500" },
                        { key: "techSkills", label: "Tech Skills", icon: Code, max: 15, color: "bg-orange-500" },
                        { key: "education", label: "Education", icon: GraduationCap, max: 10, color: "bg-pink-500" },
                        { key: "languages", label: "Languages", icon: Languages, max: 10, color: "bg-cyan-500" },
                      ].map(item => {
                        const data = validationResult.breakdown[item.key];
                        const score = data?.score || 0;
                        const pct = (score / item.max) * 100;
                        return (
                          <div key={item.key}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <item.icon className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">{item.label}</span>
                              </div>
                              <span className="text-xs font-bold text-gray-800">{score}/{item.max}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                            </div>
                            {data?.detected && data.detected.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {data.detected.map((d: string) => (
                                  <span key={d} className="px-1 py-0.5 bg-gray-50 text-gray-600 rounded text-[10px]">{d}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {validationResult.bpoExperience && validationResult.bpoExperience.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-[10px] text-gray-500 mb-1">BPO Experience Detected:</p>
                          <div className="flex flex-wrap gap-1">
                            {validationResult.bpoExperience.map((b: string) => (
                              <span key={b} className="px-1.5 py-0.5 bg-[#4B4C6A]/10 text-[#4B4C6A] rounded text-[10px] font-medium">{b}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Outreach Button */}
                  {validationResult.pass && (
                    <button onClick={() => setActiveTab("outreach")}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                      <Send className="w-4 h-4" /> Generate Outreach Message →
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "outreach" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Config */}
            <div className="bg-white rounded-xl border border-[#e6e6e5] p-5 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-800">Outreach Message Generator</h2>
                <InfoTooltip text="Create personalized recruitment messages in multiple languages and channels based on candidate CV score and role requirements" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Candidate Name *</label>
                <input value={outreachForm.candidateName} onChange={e => setOutreachForm({ ...outreachForm, candidateName: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" placeholder="Sarah Lim" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Role Title *</label>
                  <input value={outreachForm.roleTitle} onChange={e => setOutreachForm({ ...outreachForm, roleTitle: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" placeholder="Customer Service Rep" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Client</label>
                  <input value={outreachForm.client} onChange={e => setOutreachForm({ ...outreachForm, client: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Language</label>
                <div className="flex gap-2">
                  {[
                    { code: "EN", label: "English 🇬🇧" },
                    { code: "BM", label: "Bahasa 🇲🇾" },
                    { code: "ZH", label: "中文 🇨🇳" },
                  ].map(l => (
                    <button key={l.code} onClick={() => setOutreachForm({ ...outreachForm, language: l.code })}
                      className={`flex-1 py-2 rounded-lg border text-xs font-medium transition ${outreachForm.language === l.code
                        ? "bg-[#4B4C6A] text-white border-[#4B4C6A]"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Channel</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "email", label: "Email", icon: Mail },
                    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                    { id: "linkedin", label: "LinkedIn", icon: Linkedin },
                    { id: "sms", label: "SMS", icon: Phone },
                  ].map(ch => (
                    <button key={ch.id} onClick={() => setOutreachForm({ ...outreachForm, channel: ch.id })}
                      className={`p-2 rounded-lg border text-center transition ${outreachForm.channel === ch.id
                        ? "bg-[#4B4C6A] text-white border-[#4B4C6A]"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      <ch.icon className="w-4 h-4 mx-auto mb-0.5" />
                      <p className="text-[10px]">{ch.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Tone</label>
                <div className="flex gap-2">
                  {[
                    { id: "professional", label: "Professional 👔" },
                    { id: "friendly", label: "Friendly 😊" },
                    { id: "urgent", label: "Urgent ⚡" },
                  ].map(t => (
                    <button key={t.id} onClick={() => setOutreachForm({ ...outreachForm, tone: t.id })}
                      className={`flex-1 py-2 rounded-lg border text-xs font-medium transition ${outreachForm.tone === t.id
                        ? "bg-[#4B4C6A] text-white border-[#4B4C6A]"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {validationResult?.score && (
                <div className="bg-[#4B4C6A]/5 rounded-lg p-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#4B4C6A]" />
                  <span className="text-xs text-gray-600">CV Score: <strong>{validationResult.score}/100</strong> — Messages will be personalized</span>
                </div>
              )}

              <button onClick={handleGenerateOutreach} disabled={!outreachForm.candidateName || !outreachForm.roleTitle || generating}
                className="w-full flex items-center justify-center gap-2 bg-[#4B4C6A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#3a3b54] transition disabled:opacity-50">
                {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Messages</>}
              </button>
            </div>

            {/* Right: Generated Messages */}
            <div className="space-y-4">
              {!outreachResult ? (
                <div className="bg-white rounded-xl border border-[#e6e6e5] p-12 text-center">
                  <Send className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Generated messages will appear here</p>
                  <p className="text-xs text-gray-400 mt-1">Fill in candidate details and click Generate</p>
                </div>
              ) : (
                <>
                  {/* Selected Message */}
                  {outreachResult.selected && (
                    <div className="bg-white rounded-xl border-2 border-[#4B4C6A]/20 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-[#4B4C6A]">Selected — {outreachForm.channel.toUpperCase()} / {outreachForm.tone}</span>
                        <button onClick={() => handleCopy(
                          (outreachResult.selected.subject ? `Subject: ${outreachResult.selected.subject}\n\n` : "") + outreachResult.selected.body,
                          "selected"
                        )} className="text-[10px] px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 flex items-center gap-1">
                          {copied === "selected" ? <><CheckCircle2 className="w-3 h-3 text-green-500" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                        </button>
                      </div>
                      {outreachResult.selected.subject && (
                        <p className="text-xs font-medium text-gray-800 mb-2">Subject: {outreachResult.selected.subject}</p>
                      )}
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{outreachResult.selected.body}</pre>
                    </div>
                  )}

                  {/* All Tone Variations */}
                  {outreachResult.allTones && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-gray-700">All Tone Variations</h3>
                      {outreachResult.allTones.map((msg: any, i: number) => (
                        <div key={i} className="bg-white rounded-xl border border-[#e6e6e5] overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                            <span className="text-xs font-medium text-gray-600 capitalize">{msg.tone}</span>
                            <button onClick={() => handleCopy(
                              (msg.subject ? `Subject: ${msg.subject}\n\n` : "") + msg.body,
                              `tone-${i}`
                            )} className="text-[10px] px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 flex items-center gap-1">
                              {copied === `tone-${i}` ? <><CheckCircle2 className="w-3 h-3 text-green-500" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                            </button>
                          </div>
                          <div className="p-4">
                            {msg.subject && <p className="text-xs font-medium text-gray-700 mb-1">Subject: {msg.subject}</p>}
                            <pre className="text-[11px] text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{msg.body}</pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
