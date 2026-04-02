import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/cv-validate — validate CV text against a job description
// Levels: EASY (language only), MEDIUM (partial match), HARD (full match)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { cvText, roleId, level } = body as {
    cvText: string;
    roleId?: string;
    level: "EASY" | "MEDIUM" | "HARD";
  };

  if (!cvText) {
    return NextResponse.json({ error: "CV text is required" }, { status: 400 });
  }

  // Get role/JD info if provided
  let role: any = null;
  if (roleId) {
    role = await prisma.role.findUnique({ where: { id: roleId } });
  }

  const cvLower = cvText.toLowerCase();

  // ─── EASY: Language Check Only ─────────────────────────────────────
  if (level === "EASY") {
    const languages = [
      { name: "English", keywords: ["english", "ielts", "toefl", "toeic", "cambridge"] },
      { name: "Bahasa Malaysia", keywords: ["bahasa", "malay", "bm", "bahasa malaysia", "bahasa melayu"] },
      { name: "Mandarin", keywords: ["mandarin", "chinese", "hsk", "putonghua", "中文"] },
      { name: "Cantonese", keywords: ["cantonese", "广东话", "粵語"] },
      { name: "Japanese", keywords: ["japanese", "jlpt", "日本語", "nihongo"] },
      { name: "Korean", keywords: ["korean", "topik", "한국어"] },
      { name: "Thai", keywords: ["thai", "ภาษาไทย"] },
      { name: "Arabic", keywords: ["arabic", "العربية"] },
      { name: "Hindi", keywords: ["hindi", "हिन्दी"] },
      { name: "Tamil", keywords: ["tamil", "தமிழ்"] },
      { name: "French", keywords: ["french", "français", "delf"] },
      { name: "Spanish", keywords: ["spanish", "español", "dele"] },
      { name: "German", keywords: ["german", "deutsch", "goethe"] },
    ];

    const detected = languages.filter(lang =>
      lang.keywords.some(kw => cvLower.includes(kw))
    ).map(l => l.name);

    // Check if role requires specific language
    const roleTitle = role?.title?.toLowerCase() || "";
    const requiredLang = languages.find(l =>
      roleTitle.includes(l.name.toLowerCase()) ||
      l.keywords.some(kw => roleTitle.includes(kw))
    );

    const match = requiredLang ? detected.includes(requiredLang.name) : detected.length > 0;

    return NextResponse.json({
      level: "EASY",
      score: match ? 100 : 0,
      pass: match,
      detectedLanguages: detected,
      requiredLanguage: requiredLang?.name || "Any",
      summary: match
        ? `✅ Language match: Candidate speaks ${detected.join(", ")}${requiredLang ? ` (required: ${requiredLang.name})` : ""}`
        : `❌ Language mismatch: ${requiredLang ? `Role requires ${requiredLang.name}` : "No language proficiency detected"}`
    });
  }

  // ─── MEDIUM: Partial Match vs JD ───────────────────────────────────
  if (level === "MEDIUM") {
    const jdKeywords = extractJDKeywords(role);
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    for (const kw of jdKeywords) {
      if (cvLower.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }

    const score = jdKeywords.length > 0
      ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
      : 50;

    // Check experience
    const expMatch = cvLower.match(/(\d+)\s*(?:year|yr)s?\s*(?:of\s*)?(?:experience|exp)/i);
    const yearsExp = expMatch ? parseInt(expMatch[1]) : 0;

    // Check education
    const eduKeywords = ["degree", "bachelor", "master", "diploma", "spm", "stpm", "certificate", "certification"];
    const hasEducation = eduKeywords.some(e => cvLower.includes(e));

    // Check customer service specific keywords
    const csKeywords = ["customer service", "call center", "call centre", "bpo", "contact center", "support", "helpdesk", "crm"];
    const csMatch = csKeywords.filter(k => cvLower.includes(k));

    const pass = score >= 40;

    return NextResponse.json({
      level: "MEDIUM",
      score,
      pass,
      matchedKeywords,
      missingKeywords,
      yearsExperience: yearsExp,
      hasEducation,
      industryMatch: csMatch,
      summary: pass
        ? `✅ Partial match (${score}%): ${matchedKeywords.length}/${jdKeywords.length} keywords matched. ${yearsExp > 0 ? `${yearsExp}yr exp.` : ""} ${csMatch.length > 0 ? `BPO/CS experience detected.` : ""}`
        : `⚠️ Weak match (${score}%): Missing ${missingKeywords.slice(0, 5).join(", ")}. ${csMatch.length === 0 ? "No BPO/CS experience." : ""}`
    });
  }

  // ─── HARD: Full Match ──────────────────────────────────────────────
  if (level === "HARD") {
    const jdKeywords = extractJDKeywords(role);
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    for (const kw of jdKeywords) {
      if (cvLower.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }

    // Deep checks
    const expMatch = cvLower.match(/(\d+)\s*(?:year|yr)s?\s*(?:of\s*)?(?:experience|exp)/i);
    const yearsExp = expMatch ? parseInt(expMatch[1]) : 0;

    // Soft skills
    const softSkills = ["communication", "teamwork", "leadership", "problem solving", "adaptable", "flexible", "patient", "empathy", "time management", "multitask"];
    const detectedSoft = softSkills.filter(s => cvLower.includes(s));

    // Technical skills
    const techSkills = ["microsoft office", "excel", "word", "crm", "salesforce", "zendesk", "freshdesk", "ticketing", "sap", "oracle", "sql", "python", "typing"];
    const detectedTech = techSkills.filter(s => cvLower.includes(s));

    // Education level scoring
    let eduScore = 0;
    if (cvLower.includes("master") || cvLower.includes("mba")) eduScore = 100;
    else if (cvLower.includes("bachelor") || cvLower.includes("degree")) eduScore = 80;
    else if (cvLower.includes("diploma")) eduScore = 60;
    else if (cvLower.includes("spm") || cvLower.includes("stpm")) eduScore = 40;
    else if (cvLower.includes("certificate")) eduScore = 30;

    // Languages
    const languages = ["english", "bahasa", "mandarin", "cantonese", "japanese", "korean", "thai", "arabic"];
    const detectedLangs = languages.filter(l => cvLower.includes(l));

    // BPO experience
    const bpoKeywords = ["bpo", "call center", "call centre", "contact center", "outsourcing", "teleperformance", "concentrix", "alorica", "tdcx", "webhelp"];
    const bpoMatch = bpoKeywords.filter(k => cvLower.includes(k));

    // Compute composite score
    const keywordScore = jdKeywords.length > 0 ? (matchedKeywords.length / jdKeywords.length) * 30 : 15;
    const expScore = Math.min(yearsExp * 5, 20);
    const softScore = Math.min(detectedSoft.length * 3, 15);
    const techScore = Math.min(detectedTech.length * 3, 15);
    const eduPart = (eduScore / 100) * 10;
    const langScore = Math.min(detectedLangs.length * 5, 10);

    const totalScore = Math.round(keywordScore + expScore + softScore + techScore + eduPart + langScore);

    let rating: string;
    let pass: boolean;
    if (totalScore >= 70) { rating = "EXCELLENT"; pass = true; }
    else if (totalScore >= 50) { rating = "GOOD"; pass = true; }
    else if (totalScore >= 30) { rating = "FAIR"; pass = true; }
    else { rating = "POOR"; pass = false; }

    return NextResponse.json({
      level: "HARD",
      score: totalScore,
      rating,
      pass,
      breakdown: {
        keywords: { score: Math.round(keywordScore), matched: matchedKeywords.length, total: jdKeywords.length },
        experience: { score: Math.round(expScore), years: yearsExp },
        softSkills: { score: Math.round(softScore), detected: detectedSoft },
        techSkills: { score: Math.round(techScore), detected: detectedTech },
        education: { score: Math.round(eduPart), level: eduScore },
        languages: { score: Math.round(langScore), detected: detectedLangs },
      },
      bpoExperience: bpoMatch,
      missingKeywords: missingKeywords.slice(0, 10),
      summary: `${rating} (${totalScore}/100): Keywords ${Math.round(keywordScore)}/30, Exp ${Math.round(expScore)}/20, Soft ${Math.round(softScore)}/15, Tech ${Math.round(techScore)}/15, Edu ${Math.round(eduPart)}/10, Lang ${Math.round(langScore)}/10. ${bpoMatch.length > 0 ? `BPO: ${bpoMatch.join(", ")}` : "No BPO exp."}`
    });
  }

  return NextResponse.json({ error: "Invalid level. Use EASY, MEDIUM, or HARD" }, { status: 400 });
}

// Extract keywords from a role/JD
function extractJDKeywords(role: any): string[] {
  if (!role) {
    // Default BPO/CS keywords
    return [
      "customer service", "communication", "english", "support",
      "call center", "team", "computer", "typing", "problem solving",
    ];
  }

  const keywords: string[] = [];
  const title = (role.title || "").toLowerCase();

  // From title
  if (title.includes("customer service")) keywords.push("customer service", "support", "client", "communication");
  if (title.includes("technical support")) keywords.push("technical", "troubleshoot", "IT", "support", "problem solving");
  if (title.includes("sales")) keywords.push("sales", "revenue", "target", "upsell", "negotiation");

  // Language from title
  if (title.includes("en")) keywords.push("english");
  if (title.includes("bm")) keywords.push("bahasa", "malay");
  if (title.includes("mandarin")) keywords.push("mandarin", "chinese");
  if (title.includes("japanese")) keywords.push("japanese");

  // Common BPO keywords
  keywords.push("communication", "team", "computer", "typing", "customer");

  // Criticality extras
  if (role.criticality === "CRITICAL") keywords.push("experience", "senior", "leadership");
  if (role.criticality === "PRIORITY") keywords.push("experience", "skilled");

  return [...new Set(keywords)];
}
