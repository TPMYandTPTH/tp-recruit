"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PenTool, Globe, Copy, CheckCircle2, Loader2, RefreshCw,
  Instagram, MessageCircle, Linkedin, Send, Eye, Download,
  Sparkles, Hash, Image as ImageIcon, Video, Type, FileText
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

const PLATFORMS = [
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#0A66C2", maxLen: 3000, bestPractice: "Professional tone, industry keywords, hashtags" },
  { id: "facebook", name: "Facebook", icon: MessageCircle, color: "#1877F2", maxLen: 2000, bestPractice: "Engaging, visual, storytelling" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F", maxLen: 2200, bestPractice: "Short, punchy, hashtag-heavy, visual" },
  { id: "tiktok", name: "TikTok", icon: Video, color: "#000000", maxLen: 300, bestPractice: "Gen-Z tone, trendy, short captions" },
  { id: "twitter", name: "X (Twitter)", icon: Hash, color: "#1DA1F2", maxLen: 280, bestPractice: "Concise, hashtags, engagement hooks" },
  { id: "whatsapp", name: "WhatsApp Broadcast", icon: Send, color: "#25D366", maxLen: 1000, bestPractice: "Direct, personal, CTA" },
];

const LANGUAGES = [
  { code: "EN", name: "English", flag: "🇬🇧" },
  { code: "BM", name: "Bahasa Malaysia", flag: "🇲🇾" },
  { code: "ZH", name: "中文 (Chinese)", flag: "🇨🇳" },
  { code: "JA", name: "日本語 (Japanese)", flag: "🇯🇵" },
  { code: "KO", name: "한국어 (Korean)", flag: "🇰🇷" },
  { code: "TH", name: "ไทย (Thai)", flag: "🇹🇭" },
  { code: "AR", name: "العربية (Arabic)", flag: "🇸🇦" },
  { code: "HI", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
];

const CONTENT_TYPES = [
  { id: "job_ad", name: "Job Advertisement", icon: FileText, desc: "Recruitment post for open position" },
  { id: "employer_brand", name: "Employer Branding", icon: Sparkles, desc: "Company culture & values post" },
  { id: "event", name: "Event Promotion", icon: Video, desc: "Career fair, walk-in, webinar" },
  { id: "testimonial", name: "Employee Testimonial", icon: MessageCircle, desc: "Team member success story" },
  { id: "tips", name: "Career Tips", icon: PenTool, desc: "Interview tips, resume advice" },
  { id: "milestone", name: "Company Milestone", icon: CheckCircle2, desc: "Awards, achievements, growth" },
];

function generateContent(params: {
  type: string; platform: string; language: string;
  roleTitle: string; highlights: string; tone: string;
}) {
  const { type, platform, language, roleTitle, highlights, tone } = params;
  const isShort = ["tiktok", "twitter"].includes(platform);

  const templates: Record<string, Record<string, string>> = {
    EN: {
      job_ad: isShort
        ? `🔥 We're hiring! ${roleTitle} at TP Malaysia\n\n${highlights || "Great pay + benefits"}\n\nApply now 👉 Link in bio\n\n#TPMalaysia #Hiring #NowHiring #BPO #CareerOpportunity`
        : `🚀 JOIN OUR TEAM!\n\nTeleperformance Malaysia is looking for a ${roleTitle}!\n\n${highlights || "What we offer:\n✅ Competitive salary\n✅ Medical & dental benefits\n✅ Career growth opportunities\n✅ Modern office environment\n✅ Great team culture"}\n\n📍 Location: KL / Cyberjaya\n\nReady for your next career move? Apply now!\n🔗 Link in bio / DM us\n\n#Teleperformance #TPMalaysia #Hiring #${roleTitle.replace(/\s+/g, "")} #BPO #CustomerService #JobsMalaysia #KLJobs`,
      employer_brand: `Life at Teleperformance Malaysia ✨\n\nWhat makes TP special? Our people! 💜\n\nFrom team bonding to career growth, we believe in creating an environment where everyone thrives.\n\n🎯 Diverse & inclusive workplace\n🌍 Global opportunities\n📚 Continuous learning\n🎉 Fun team activities\n\nJoin 420,000+ team members worldwide!\n\n#LifeAtTP #TPMalaysia #WorkCulture #EmployerOfChoice #BPOLife`,
      event: `📢 WALK-IN INTERVIEW DAY!\n\n📅 Date: This Saturday\n📍 Location: TP Malaysia Office\n⏰ Time: 9AM - 4PM\n\nPositions available:\n🎯 ${roleTitle || "Customer Service Representatives"}\n💰 Attractive salary packages\n⚡ Same-day offers!\n\nBring your resume and walk in!\n\n#WalkIn #JobFair #TPMalaysia #HiringNow`,
      testimonial: `Meet our star team member! ⭐\n\n"I joined TP Malaysia as a ${roleTitle || "CSR"} and within 2 years, I've grown into a team lead. The support and development here is amazing!"\n\n— TP Malaysia Team Member\n\nYour success story could be next! 🚀\n\n#TPStories #CareerGrowth #TPMalaysia`,
      tips: `📋 Interview Tips from TP Malaysia!\n\n1️⃣ Research the company\n2️⃣ Practice common questions\n3️⃣ Dress professionally\n4️⃣ Arrive 15 minutes early\n5️⃣ Prepare questions to ask\n\nBonus: Smile and be confident! 😊\n\n#InterviewTips #CareerAdvice #TPMalaysia`,
      milestone: `🏆 Proud moment for TP Malaysia!\n\nWe've been recognized as a Top Employer for 2026! 🎉\n\nThis is all thanks to our amazing team of 5,000+ employees who make TP a great place to work every day.\n\n#TopEmployer #TPMalaysia #ProudMoment #BestWorkplace`,
    },
    BM: {
      job_ad: isShort
        ? `🔥 Kami sedang mengambil pekerja! ${roleTitle} di TP Malaysia\n\n${highlights || "Gaji menarik + manfaat"}\n\nMohon sekarang 👉 Link di bio\n\n#TPMalaysia #Jawatan #KerjaKosong #BPO`
        : `🚀 SERTAI PASUKAN KAMI!\n\nTeleperformance Malaysia sedang mencari ${roleTitle}!\n\n${highlights || "Apa yang kami tawarkan:\n✅ Gaji kompetitif\n✅ Manfaat perubatan & pergigian\n✅ Peluang perkembangan kerjaya\n✅ Pejabat moden\n✅ Budaya kerja yang hebat"}\n\n📍 Lokasi: KL / Cyberjaya\n\nBersedia untuk langkah kerjaya seterusnya? Mohon sekarang!\n🔗 Link di bio / DM kami\n\n#Teleperformance #TPMalaysia #KerjaKosong #${roleTitle.replace(/\s+/g, "")} #BPO #KhidmatPelanggan`,
      employer_brand: `Kehidupan di Teleperformance Malaysia ✨\n\nApa yang menjadikan TP istimewa? Insan kami! 💜\n\n🎯 Tempat kerja pelbagai & inklusif\n🌍 Peluang global\n📚 Pembelajaran berterusan\n🎉 Aktiviti pasukan yang seronok\n\n#KehidupanDiTP #TPMalaysia #BudayaKerja`,
      event: `📢 HARI TEMUDUGA WALK-IN!\n\n📅 Tarikh: Sabtu ini\n📍 Lokasi: Pejabat TP Malaysia\n⏰ Masa: 9PG - 4PTG\n\n🎯 ${roleTitle || "Wakil Khidmat Pelanggan"}\n💰 Pakej gaji menarik\n⚡ Tawaran hari yang sama!\n\nBawa resume anda!\n\n#WalkIn #TemudugaKerja #TPMalaysia`,
      testimonial: `Kenali ahli pasukan bintang kami! ⭐\n\n"Saya menyertai TP Malaysia sebagai ${roleTitle || "CSR"} dan dalam 2 tahun, saya sudah menjadi ketua pasukan!"\n\n#CeritaTP #PerkembanganKerjaya #TPMalaysia`,
      tips: `📋 Tips Temuduga dari TP Malaysia!\n\n1️⃣ Kaji syarikat\n2️⃣ Latih soalan lazim\n3️⃣ Berpakaian profesional\n4️⃣ Tiba 15 minit awal\n5️⃣ Sediakan soalan\n\n#TipsTemuduga #NasihatKerjaya #TPMalaysia`,
      milestone: `🏆 TP Malaysia diiktiraf sebagai Majikan Terbaik 2026! 🎉\n\nTerima kasih kepada 5,000+ pekerja kami!\n\n#MajikanTerbaik #TPMalaysia`,
    },
    ZH: {
      job_ad: isShort
        ? `🔥 TP马来西亚招聘中！${roleTitle}\n\n${highlights || "薪资优厚+福利齐全"}\n\n立即申请 👉\n\n#TP马来西亚 #招聘 #BPO`
        : `🚀 加入我们的团队！\n\nTeleperformance马来西亚正在招聘${roleTitle}！\n\n${highlights || "我们提供：\n✅ 有竞争力的薪资\n✅ 医疗和牙科福利\n✅ 职业发展机会\n✅ 现代化办公环境"}\n\n📍 地点: 吉隆坡 / 赛城\n\n准备好迈出下一步了吗？立即申请！\n\n#Teleperformance #TP马来西亚 #招聘 #BPO #客户服务`,
      employer_brand: `在Teleperformance马来西亚的生活 ✨\n\n🎯 多元包容的工作环境\n🌍 全球发展机会\n📚 持续学习成长\n🎉 丰富的团队活动\n\n#TP生活 #工作文化 #TP马来西亚`,
      event: `📢 现场面试日！\n\n📅 日期：本周六\n📍 地点：TP马来西亚办公室\n⏰ 时间：上午9点-下午4点\n\n🎯 ${roleTitle || "客服代表"}\n💰 优厚薪资\n⚡ 当天发offer！\n\n#现场面试 #TP马来西亚 #招聘`,
      testimonial: `认识我们的明星员工！⭐\n\n"加入TP马来西亚后，我在2年内从${roleTitle || "客服"}晋升为团队主管！"\n\n#TP故事 #职业成长`,
      tips: `📋 TP马来西亚面试小贴士！\n\n1️⃣ 了解公司\n2️⃣ 练习常见问题\n3️⃣ 穿着专业\n4️⃣ 提前15分钟到达\n5️⃣ 准备提问\n\n#面试技巧 #职业建议`,
      milestone: `🏆 TP马来西亚荣获2026年最佳雇主！🎉\n\n感谢5000+员工的共同努力！\n\n#最佳雇主 #TP马来西亚`,
    },
  };

  const langContent = templates[language] || templates["EN"];
  return langContent[type] || langContent["job_ad"];
}

export default function ContentCreatorPage() {
  const [contentType, setContentType] = useState("job_ad");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin", "facebook", "instagram"]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["EN"]);
  const [roleTitle, setRoleTitle] = useState("Customer Service Representative");
  const [highlights, setHighlights] = useState("");
  const [tone, setTone] = useState("professional");
  const [generated, setGenerated] = useState<Record<string, Record<string, string>>>({});
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [previewPlatform, setPreviewPlatform] = useState<string | null>(null);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };
  const toggleLang = (code: string) => {
    setSelectedLanguages(l => l.includes(code) ? l.filter(x => x !== code) : [...l, code]);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const results: Record<string, Record<string, string>> = {};
      for (const lang of selectedLanguages) {
        results[lang] = {};
        for (const plat of selectedPlatforms) {
          results[lang][plat] = generateContent({
            type: contentType, platform: plat, language: lang,
            roleTitle, highlights, tone,
          });
        }
      }
      setGenerated(results);
      setGenerating(false);
    }, 1200);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const totalVariations = selectedPlatforms.length * selectedLanguages.length;

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />
      {/* Header */}
      <div className="bg-[#4B4C6A] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <PenTool className="w-5 h-5" />
              <h1 className="text-lg font-bold">Content Creator</h1>
            </div>
            <p className="text-xs text-white/60">Generate recruitment content in multiple languages for all platforms</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sourcing" className="text-xs text-white/70 hover:text-white">← Sourcing Hub</Link>
            <Link href="/sourcing/job-posts" className="text-xs text-white/70 hover:text-white">Job Posts</Link>
            <Link href="/sourcing/trap" className="text-xs text-white/70 hover:text-white">TRAP Ads</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Content Type */}
        <div className="bg-white rounded-xl border border-[#e6e6e5] p-5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Content Type</h2>
            <InfoTooltip text="Choose content type: job ads, employer branding, event promotion, testimonials, tips, or company milestones" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {CONTENT_TYPES.map(ct => (
              <button key={ct.id} onClick={() => setContentType(ct.id)}
                className={`p-3 rounded-lg border text-center transition ${contentType === ct.id
                  ? "border-[#4B4C6A] bg-[#4B4C6A]/5"
                  : "border-gray-200 hover:border-gray-300"}`}>
                <ct.icon className={`w-5 h-5 mx-auto mb-1 ${contentType === ct.id ? "text-[#4B4C6A]" : "text-gray-400"}`} />
                <p className="text-xs font-medium text-gray-700">{ct.name}</p>
                <p className="text-[10px] text-gray-400">{ct.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Config */}
          <div className="space-y-5">
            {/* Platforms */}
            <div className="bg-white rounded-xl border border-[#e6e6e5] p-5">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-gray-800">Platforms ({selectedPlatforms.length})</h2>
                <InfoTooltip text="Select social platforms where this content will be posted: LinkedIn, Facebook, Instagram, TikTok, Twitter, WhatsApp" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => togglePlatform(p.id)}
                    className={`p-2.5 rounded-lg border text-center transition ${selectedPlatforms.includes(p.id)
                      ? "border-[#4B4C6A] bg-[#4B4C6A]/5"
                      : "border-gray-200 hover:border-gray-300"}`}>
                    <p.icon className="w-4 h-4 mx-auto mb-1" style={{ color: selectedPlatforms.includes(p.id) ? p.color : "#9CA3AF" }} />
                    <p className="text-xs font-medium text-gray-700">{p.name}</p>
                    <p className="text-[10px] text-gray-400">Max {p.maxLen}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-xl border border-[#e6e6e5] p-5">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-gray-800">Languages ({selectedLanguages.length})</h2>
                <InfoTooltip text="Generate content in multiple languages to reach diverse candidate pools across Malaysia and Southeast Asia" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => toggleLang(l.code)}
                    className={`p-2 rounded-lg border text-center transition ${selectedLanguages.includes(l.code)
                      ? "border-[#4B4C6A] bg-[#4B4C6A]/5"
                      : "border-gray-200 hover:border-gray-300"}`}>
                    <span className="text-lg">{l.flag}</span>
                    <p className="text-[10px] font-medium text-gray-700 mt-0.5">{l.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl border border-[#e6e6e5] p-5 space-y-3">
              <h2 className="text-sm font-semibold text-gray-800">Content Details</h2>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role / Position Title</label>
                <input value={roleTitle} onChange={e => setRoleTitle(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Customer Service Representative" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Key Highlights (optional)</label>
                <textarea value={highlights} onChange={e => setHighlights(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 h-20 resize-none"
                  placeholder="Add custom highlights to include in the post..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tone</label>
                <div className="flex gap-2">
                  {["professional", "friendly", "urgent", "gen-z"].map(t => (
                    <button key={t} onClick={() => setTone(t)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition ${tone === t
                        ? "bg-[#4B4C6A] text-white border-[#4B4C6A]"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button onClick={handleGenerate} disabled={generating || selectedPlatforms.length === 0 || selectedLanguages.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-[#4B4C6A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#3a3b54] transition disabled:opacity-50">
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating {totalVariations} variations...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate {totalVariations} Content Variations</>
              )}
            </button>
          </div>

          {/* Right: Generated Content */}
          <div className="space-y-4">
            {Object.keys(generated).length === 0 ? (
              <div className="bg-white rounded-xl border border-[#e6e6e5] p-12 text-center">
                <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Generated content will appear here</p>
                <p className="text-xs text-gray-400 mt-1">Select platforms, languages, and click Generate</p>
              </div>
            ) : (
              Object.entries(generated).map(([lang, platforms]) => {
                const langInfo = LANGUAGES.find(l => l.code === lang);
                return (
                  <div key={lang} className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="text-lg">{langInfo?.flag}</span> {langInfo?.name}
                    </h3>
                    {Object.entries(platforms).map(([platId, content]) => {
                      const plat = PLATFORMS.find(p => p.id === platId);
                      const key = `${lang}-${platId}`;
                      return (
                        <div key={key} className="bg-white rounded-xl border border-[#e6e6e5] overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-2">
                              {plat && <plat.icon className="w-4 h-4" style={{ color: plat.color }} />}
                              <span className="text-xs font-semibold text-gray-700">{plat?.name}</span>
                              <span className="text-[10px] text-gray-400">{content.length}/{plat?.maxLen} chars</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleCopy(content, key)}
                                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-white border border-gray-200 hover:bg-gray-50">
                                {copied === key ? <><CheckCircle2 className="w-3 h-3 text-green-500" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                              </button>
                              <button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-white border border-gray-200 hover:bg-gray-50">
                                <RefreshCw className="w-3 h-3" /> Regen
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{content}</pre>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
