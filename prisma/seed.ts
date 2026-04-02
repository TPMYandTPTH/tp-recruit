import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with comprehensive demo data...\n");

  // Clean existing data
  await prisma.approval.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.screeningQuestion.deleteMany();
  await prisma.sourcingChannel.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.role.deleteMany();
  console.log("Cleaned existing data.\n");

  // ===== ROLES (8 roles across 4 clients) =====
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        title: "Customer Service Agent - EN",
        client: "TechCorp Global",
        campaign: "Q2 2026 Support",
        salaryMin: 4800, salaryMid: 5500, salaryMax: 6200,
        currency: "MYR", marketMedian: 5400,
        criticality: "STANDARD", interviewMode: "HUMAN_INTERVIEW",
        totalPositions: 50, filledPositions: 28,
      },
    }),
    prisma.role.create({
      data: {
        title: "Customer Service Agent - BM",
        client: "TechCorp Global",
        campaign: "Q2 2026 Support",
        salaryMin: 4500, salaryMid: 5200, salaryMax: 5900,
        currency: "MYR", marketMedian: 5100,
        criticality: "PRIORITY", interviewMode: "AI_INTERVIEW",
        totalPositions: 30, filledPositions: 12,
      },
    }),
    prisma.role.create({
      data: {
        title: "Technical Support Agent - EN",
        client: "CloudPlatform Inc",
        campaign: "Tier 1 Support",
        salaryMin: 5500, salaryMid: 6400, salaryMax: 7200,
        currency: "MYR", marketMedian: 6300,
        criticality: "CRITICAL", interviewMode: "HUMAN_INTERVIEW",
        totalPositions: 20, filledPositions: 5,
      },
    }),
    prisma.role.create({
      data: {
        title: "Sales Support Agent",
        client: "RetailMax",
        campaign: "Holiday Peak 2026",
        salaryMin: 4200, salaryMid: 4800, salaryMax: 5400,
        currency: "MYR",
        criticality: "STANDARD", interviewMode: "NO_INTERVIEW",
        totalPositions: 100, filledPositions: 65,
      },
    }),
    prisma.role.create({
      data: {
        title: "Customer Service Agent - Mandarin",
        client: "TechCorp Global",
        campaign: "CN Support Q2",
        salaryMin: 5000, salaryMid: 5800, salaryMax: 6500,
        currency: "MYR", marketMedian: 5700,
        criticality: "CRITICAL", interviewMode: "HUMAN_INTERVIEW",
        totalPositions: 25, filledPositions: 8,
      },
    }),
    prisma.role.create({
      data: {
        title: "Technical Support Agent - Japanese",
        client: "Gaming Co",
        campaign: "APAC Gaming Support",
        salaryMin: 5500, salaryMid: 7000, salaryMax: 8000,
        currency: "MYR", marketMedian: 6800,
        criticality: "CRITICAL", interviewMode: "HUMAN_INTERVIEW",
        totalPositions: 10, filledPositions: 2,
      },
    }),
    prisma.role.create({
      data: {
        title: "Sales Agent - BM",
        client: "Telco Provider",
        campaign: "Outbound Sales MY",
        salaryMin: 3000, salaryMid: 4000, salaryMax: 4500,
        currency: "MYR", marketMedian: 3800,
        criticality: "STANDARD", interviewMode: "HUMAN_INTERVIEW",
        totalPositions: 40, filledPositions: 22,
      },
    }),
    prisma.role.create({
      data: {
        title: "Customer Service Agent - Korean",
        client: "Cosmetics Brand",
        campaign: "K-Beauty Support",
        salaryMin: 5200, salaryMid: 6200, salaryMax: 7000,
        currency: "MYR", marketMedian: 6000,
        criticality: "PRIORITY", interviewMode: "HUMAN_INTERVIEW",
        totalPositions: 8, filledPositions: 1,
      },
    }),
  ]);
  console.log(`✅ Created ${roles.length} roles`);

  // ===== SCREENING QUESTIONS =====
  const questions = await Promise.all([
    prisma.screeningQuestion.create({ data: { category: "ELIGIBILITY", question: "Are you 18 years of age or older?", type: "YES_NO", isRequired: true, failValue: "false", order: 1 } }),
    prisma.screeningQuestion.create({ data: { category: "ELIGIBILITY", question: "Are you legally authorized to work in Malaysia?", type: "YES_NO", isRequired: true, failValue: "false", order: 2 } }),
    prisma.screeningQuestion.create({ data: { category: "ELIGIBILITY", question: "Are you available to start within the next 30 days?", type: "YES_NO", isRequired: true, order: 3 } }),
    prisma.screeningQuestion.create({ data: { category: "SKILLS", question: "How would you rate your English proficiency?", type: "MULTIPLE_CHOICE", options: JSON.stringify(["Native / Bilingual", "Advanced (C1-C2)", "Intermediate (B1-B2)", "Basic (A1-A2)"]), isRequired: true, failValue: "Basic (A1-A2)", order: 4 } }),
    prisma.screeningQuestion.create({ data: { category: "SKILLS", question: "How many years of customer service experience do you have?", type: "MULTIPLE_CHOICE", options: JSON.stringify(["No experience", "Less than 1 year", "1-3 years", "3-5 years", "More than 5 years"]), isRequired: true, order: 5 } }),
    prisma.screeningQuestion.create({ data: { category: "SKILLS", question: "What is your typing speed (words per minute)?", type: "MULTIPLE_CHOICE", options: JSON.stringify(["Below 25 WPM", "25-40 WPM", "40-60 WPM", "Above 60 WPM"]), isRequired: true, order: 6 } }),
    prisma.screeningQuestion.create({ data: { category: "SALARY", question: "What is your expected monthly salary (MYR)?", type: "SALARY_INPUT", isRequired: true, order: 7 } }),
  ]);
  console.log(`✅ Created ${questions.length} screening questions`);

  // ===== 20 CANDIDATES =====
  const d = (days: number) => new Date(Date.now() - days * 86400000);
  const sources = ["JOB_BOARD", "PORTAL", "REFERRAL", "WALK_IN", "SOCIAL_MEDIA"];

  const candidates = await Promise.all([
    // --- SCREENING (3) ---
    prisma.candidate.create({ data: { portalToken: "tok-001", firstName: "Sarah", lastName: "Ahmad", email: "sarah.ahmad@email.com", phone: "+60123456789", roleId: roles[0].id, source: "JOB_BOARD", expectedSalary: 5200, stage: "SCREENING" } }),
    prisma.candidate.create({ data: { portalToken: "tok-002", firstName: "Ahmad", lastName: "Razak", email: "ahmad.razak@email.com", phone: "+60178901234", roleId: roles[6].id, source: "WALK_IN", expectedSalary: 3500, stage: "SCREENING" } }),
    prisma.candidate.create({ data: { portalToken: "tok-003", firstName: "Priya", lastName: "Devi", email: "priya.devi@email.com", phone: "+60162345678", roleId: roles[0].id, source: "SOCIAL_MEDIA", expectedSalary: 5000, stage: "SCREENING" } }),
    // --- ASSESSMENT_PENDING (2) ---
    prisma.candidate.create({ data: { portalToken: "tok-004", firstName: "Ali", lastName: "Hassan", email: "ali.hassan@email.com", phone: "+60145678901", roleId: roles[1].id, source: "PORTAL", expectedSalary: 5000, stage: "ASSESSMENT_PENDING", screeningPassedAt: d(5), screeningData: JSON.stringify([{ q: "age", a: true }, { q: "auth", a: true }]) } }),
    prisma.candidate.create({ data: { portalToken: "tok-005", firstName: "Nurul", lastName: "Izzah", email: "nurul.izzah@email.com", phone: "+60189012345", roleId: roles[4].id, source: "JOB_BOARD", expectedSalary: 5500, stage: "ASSESSMENT_PENDING", screeningPassedAt: d(3) } }),
    // --- ASSESSMENT_IN_PROGRESS (2) ---
    prisma.candidate.create({ data: { portalToken: "tok-006", firstName: "Fatimah", lastName: "Zahra", email: "fatimah.zahra@email.com", phone: "+60134567890", roleId: roles[0].id, source: "SOCIAL_MEDIA", expectedSalary: 5300, stage: "ASSESSMENT_IN_PROGRESS", screeningPassedAt: d(7) } }),
    prisma.candidate.create({ data: { portalToken: "tok-007", firstName: "Lee", lastName: "Jun Wei", email: "junwei.lee@email.com", phone: "+60185678901", roleId: roles[4].id, source: "REFERRAL", expectedSalary: 5600, stage: "ASSESSMENT_IN_PROGRESS", screeningPassedAt: d(6) } }),
    // --- INTERVIEW_SCHEDULED (2) ---
    prisma.candidate.create({ data: { portalToken: "tok-008", firstName: "Aisha", lastName: "Rahman", email: "aisha.rahman@email.com", phone: "+60156789012", roleId: roles[1].id, source: "JOB_BOARD", expectedSalary: 5100, stage: "INTERVIEW_SCHEDULED", screeningPassedAt: d(14), assessmentPassedAt: d(7), interviewScheduledAt: new Date(Date.now() + 3 * 86400000) } }),
    prisma.candidate.create({ data: { portalToken: "tok-009", firstName: "Tanaka", lastName: "Yuki", email: "tanaka.yuki@email.com", phone: "+60114567890", roleId: roles[5].id, source: "PORTAL", expectedSalary: 7000, stage: "INTERVIEW_SCHEDULED", screeningPassedAt: d(10), assessmentPassedAt: d(5), interviewScheduledAt: new Date(Date.now() + 1 * 86400000) } }),
    // --- SELECTED (3, ready for offers) ---
    prisma.candidate.create({ data: { portalToken: "tok-010", firstName: "James", lastName: "Chen", email: "james.chen@email.com", phone: "+60198765432", roleId: roles[0].id, source: "REFERRAL", expectedSalary: 5900, stage: "SELECTED", screeningPassedAt: d(21), assessmentPassedAt: d(14), interviewPassedAt: d(3) } }),
    prisma.candidate.create({ data: { portalToken: "tok-011", firstName: "Park", lastName: "Min-jun", email: "park.minjun@email.com", phone: "+60198901234", roleId: roles[7].id, source: "PORTAL", expectedSalary: 6500, stage: "SELECTED", screeningPassedAt: d(18), assessmentPassedAt: d(12), interviewPassedAt: d(2) } }),
    prisma.candidate.create({ data: { portalToken: "tok-012", firstName: "Lim", lastName: "Wei Ling", email: "sarah.lim@email.com", phone: "+60123456700", roleId: roles[4].id, source: "JOB_BOARD", expectedSalary: 5400, stage: "SELECTED", screeningPassedAt: d(15), assessmentPassedAt: d(10), interviewPassedAt: d(2) } }),
    // --- OFFER_SENT (2) ---
    prisma.candidate.create({ data: { portalToken: "tok-013", firstName: "Wei", lastName: "Lin", email: "wei.lin@email.com", phone: "+60167890123", roleId: roles[2].id, source: "REFERRAL", expectedSalary: 6200, stage: "OFFER_SENT", screeningPassedAt: d(21), assessmentPassedAt: d(14), interviewPassedAt: d(5) } }),
    prisma.candidate.create({ data: { portalToken: "tok-014", firstName: "Maria", lastName: "Garcia", email: "maria.garcia@email.com", phone: "+60145670123", roleId: roles[6].id, source: "WALK_IN", expectedSalary: 3800, stage: "OFFER_SENT", screeningPassedAt: d(18), assessmentPassedAt: d(10), interviewPassedAt: d(4) } }),
    // --- OFFER_ACCEPTED (2) ---
    prisma.candidate.create({ data: { portalToken: "tok-015", firstName: "Maria", lastName: "Santos", email: "maria.santos@email.com", phone: "+60178901234", roleId: roles[3].id, source: "WALK_IN", expectedSalary: 4500, stage: "OFFER_ACCEPTED", screeningPassedAt: d(28), assessmentPassedAt: d(21), interviewPassedAt: d(10), onboardingStartedAt: d(2) } }),
    prisma.candidate.create({ data: { portalToken: "tok-016", firstName: "Siti", lastName: "Nurhaliza", email: "siti.nur@email.com", phone: "+60156780123", roleId: roles[1].id, source: "JOB_BOARD", expectedSalary: 4900, stage: "OFFER_ACCEPTED", screeningPassedAt: d(30), assessmentPassedAt: d(22), interviewPassedAt: d(12) } }),
    // --- ONBOARDING (2) ---
    prisma.candidate.create({ data: { portalToken: "tok-017", firstName: "Raj", lastName: "Patel", email: "raj.patel@email.com", phone: "+60189012345", roleId: roles[3].id, source: "PORTAL", expectedSalary: 4600, stage: "ONBOARDING", screeningPassedAt: d(35), assessmentPassedAt: d(28), interviewPassedAt: d(14), onboardingStartedAt: d(5), bgvStatus: "IN_PROGRESS" } }),
    prisma.candidate.create({ data: { portalToken: "tok-018", firstName: "Chen", lastName: "Mei Ling", email: "chen.meiling@email.com", phone: "+60134560123", roleId: roles[4].id, source: "REFERRAL", expectedSalary: 5600, stage: "ONBOARDING", screeningPassedAt: d(40), assessmentPassedAt: d(30), interviewPassedAt: d(18), onboardingStartedAt: d(3), bgvStatus: "PASSED", documentsUploaded: true } }),
    // --- REJECTED (2) ---
    prisma.candidate.create({ data: { portalToken: "tok-019", firstName: "Kenji", lastName: "Tanaka", email: "kenji.tanaka@email.com", phone: "+60114560123", roleId: roles[2].id, source: "WALK_IN", expectedSalary: 8500, stage: "REJECTED", screeningPassedAt: d(14), assessmentPassedAt: d(7) } }),
    prisma.candidate.create({ data: { portalToken: "tok-020", firstName: "Mohd", lastName: "Amin", email: "mohd.amin@email.com", phone: "+60167891234", roleId: roles[0].id, source: "SOCIAL_MEDIA", expectedSalary: 7000, stage: "REJECTED", screeningPassedAt: d(10) } }),
  ]);
  console.log(`✅ Created ${candidates.length} candidates`);

  // ===== OFFERS (8 offers with different tiers) =====
  // GREEN tier offer for Maria Santos (accepted)
  const offer1 = await prisma.offer.create({ data: {
    candidateId: candidates[14].id, round: 1, offeredSalary: 4500, tier: "GREEN",
    baseSalary: 4500, approvalStatus: "AUTO_APPROVED", status: "ACCEPTED",
    calculationNotes: "Salary ≤ midpoint (4800). Auto-approved per GREEN tier policy.",
    sentAt: d(5), respondedAt: d(3),
  }});
  // GREEN tier offer for Siti (accepted)
  const offer2 = await prisma.offer.create({ data: {
    candidateId: candidates[15].id, round: 1, offeredSalary: 4900, tier: "GREEN",
    baseSalary: 4900, approvalStatus: "AUTO_APPROVED", status: "ACCEPTED",
    calculationNotes: "Salary ≤ midpoint (5200). Auto-approved per GREEN tier policy.",
    sentAt: d(8), respondedAt: d(6),
  }});
  // GREEN offer for Wei Lin (sent, awaiting response)
  const offer3 = await prisma.offer.create({ data: {
    candidateId: candidates[12].id, round: 1, offeredSalary: 6200, tier: "GREEN",
    baseSalary: 6200, approvalStatus: "AUTO_APPROVED", status: "SENT",
    calculationNotes: "Salary ≤ midpoint (6400). Auto-approved.",
    sentAt: d(1),
  }});
  // AMBER tier offer for Maria Garcia (sent, pending TA Lead approval)
  const offer4 = await prisma.offer.create({ data: {
    candidateId: candidates[13].id, round: 1, offeredSalary: 4200, tier: "AMBER",
    baseSalary: 3800, criticalityAdj: 0, fillRateAdj: 200, marketAdj: 200,
    approvalStatus: "PENDING", status: "PENDING_APPROVAL",
    calculationNotes: "Salary above midpoint (4000) but below max (4500). AMBER tier — parallel approval by TA Lead + Director required.",
    aiSummary: "Walk-in candidate with sales background. Offer at RM 4,200 is 5% above midpoint, justified by fill rate pressure (55% filled).",
  }});
  // AMBER offer for Raj Patel (approved, onboarding)
  const offer5 = await prisma.offer.create({ data: {
    candidateId: candidates[16].id, round: 1, offeredSalary: 5000, tier: "AMBER",
    baseSalary: 4600, fillRateAdj: 200, marketAdj: 200,
    approvalStatus: "APPROVED", status: "ACCEPTED",
    calculationNotes: "Above midpoint (4800). Approved via parallel approval.",
    sentAt: d(8), respondedAt: d(6),
  }});
  // RED tier offer for James Chen (pending sequential approval)
  const offer6 = await prisma.offer.create({ data: {
    candidateId: candidates[9].id, round: 1, offeredSalary: 6400, tier: "RED",
    baseSalary: 5900, criticalityAdj: 0, fillRateAdj: 300, marketAdj: 200,
    approvalStatus: "PENDING", status: "PENDING_APPROVAL",
    calculationNotes: "Salary above max (6200). RED tier — sequential approval: TA Lead → Director → COO required.",
    aiSummary: "Strong referral candidate with 3yr BPO experience. Offer at RM 6,400 exceeds max by RM 200. Justified by referral quality and low fill rate (56%).",
  }});
  // RED offer (declined by candidate, round 1)
  const offer7 = await prisma.offer.create({ data: {
    candidateId: candidates[18].id, round: 1, offeredSalary: 7000, tier: "RED",
    baseSalary: 6800, criticalityAdj: 200, fillRateAdj: 0, marketAdj: 0,
    approvalStatus: "APPROVED", status: "DECLINED",
    calculationNotes: "Critical role, above max. Sequential approval completed.",
    declineReason: "Expected higher salary based on experience",
    declineCategory: "SALARY",
    sentAt: d(10), respondedAt: d(8),
  }});
  // GREEN offer for Chen Mei Ling (accepted, onboarding)
  const offer8 = await prisma.offer.create({ data: {
    candidateId: candidates[17].id, round: 1, offeredSalary: 5600, tier: "GREEN",
    baseSalary: 5600, approvalStatus: "AUTO_APPROVED", status: "ACCEPTED",
    calculationNotes: "Salary ≤ midpoint (5800). Auto-approved.",
    sentAt: d(6), respondedAt: d(4),
  }});
  console.log(`✅ Created 8 offers`);

  // ===== APPROVALS =====
  // AMBER offer4 approvals (parallel — both pending)
  await prisma.approval.create({ data: {
    offerId: offer4.id, approverEmail: "aisha.ta@tp.com", approverName: "Aisha Binti Rahman", approverRole: "TA_LEAD",
    status: "PENDING", sentAt: d(1), slaDeadline: new Date(Date.now() + 1 * 86400000),
  }});
  await prisma.approval.create({ data: {
    offerId: offer4.id, approverEmail: "david.dir@tp.com", approverName: "David Tan", approverRole: "DIRECTOR",
    status: "PENDING", sentAt: d(1), slaDeadline: new Date(Date.now() + 2 * 86400000),
  }});
  // AMBER offer5 approvals (both approved)
  await prisma.approval.create({ data: {
    offerId: offer5.id, approverEmail: "aisha.ta@tp.com", approverName: "Aisha Binti Rahman", approverRole: "TA_LEAD",
    status: "APPROVED", decidedAt: d(9), sentAt: d(10), slaDeadline: d(8), notes: "Good candidate. Approved.",
  }});
  await prisma.approval.create({ data: {
    offerId: offer5.id, approverEmail: "david.dir@tp.com", approverName: "David Tan", approverRole: "DIRECTOR",
    status: "APPROVED", decidedAt: d(9), sentAt: d(10), slaDeadline: d(8),
  }});
  // RED offer6 approvals (sequential — TA Lead approved, Director pending)
  await prisma.approval.create({ data: {
    offerId: offer6.id, approverEmail: "aisha.ta@tp.com", approverName: "Aisha Binti Rahman", approverRole: "TA_LEAD",
    status: "APPROVED", decidedAt: d(1), sentAt: d(2), slaDeadline: d(0), notes: "Strong referral. Worth the premium.",
  }});
  await prisma.approval.create({ data: {
    offerId: offer6.id, approverEmail: "david.dir@tp.com", approverName: "David Tan", approverRole: "DIRECTOR",
    status: "PENDING", sentAt: d(1), slaDeadline: new Date(Date.now() + 1 * 86400000),
  }});
  await prisma.approval.create({ data: {
    offerId: offer6.id, approverEmail: "coo@tp.com", approverName: "Sarah Lee (COO)", approverRole: "COO",
    status: "PENDING", sentAt: d(0), slaDeadline: new Date(Date.now() + 3 * 86400000),
  }});
  // RED offer7 approvals (all approved, but candidate declined)
  await prisma.approval.create({ data: {
    offerId: offer7.id, approverEmail: "aisha.ta@tp.com", approverName: "Aisha Binti Rahman", approverRole: "TA_LEAD",
    status: "APPROVED", decidedAt: d(12), sentAt: d(13), slaDeadline: d(11),
  }});
  await prisma.approval.create({ data: {
    offerId: offer7.id, approverEmail: "david.dir@tp.com", approverName: "David Tan", approverRole: "DIRECTOR",
    status: "APPROVED", decidedAt: d(11), sentAt: d(12), slaDeadline: d(10),
  }});
  await prisma.approval.create({ data: {
    offerId: offer7.id, approverEmail: "coo@tp.com", approverName: "Sarah Lee (COO)", approverRole: "COO",
    status: "APPROVED", decidedAt: d(11), sentAt: d(11), slaDeadline: d(9),
  }});
  console.log(`✅ Created 11 approvals`);

  // ===== SOURCING CHANNELS (9 channels) =====
  await Promise.all([
    prisma.sourcingChannel.create({ data: { name: "JobStreet Malaysia", type: "JOB_BOARD", platform: "jobstreet", isActive: true, autoImport: true, importUrl: "https://api.jobstreet.com.my/v1/applications", costPerHire: 350, monthlyBudget: 8000, totalCandidates: 245, totalHired: 42, lastImportAt: d(0), lastImportCount: 12, notes: "Primary job board for MY market", contactPerson: "JobStreet Rep", contactEmail: "enterprise@jobstreet.com.my" } }),
    prisma.sourcingChannel.create({ data: { name: "LinkedIn Recruiter", type: "SOCIAL_MEDIA", platform: "linkedin", isActive: true, autoImport: false, costPerHire: 520, monthlyBudget: 12000, totalCandidates: 178, totalHired: 28, lastImportAt: d(1), lastImportCount: 8, notes: "Best for senior/technical roles", contactPerson: "LinkedIn CSM" } }),
    prisma.sourcingChannel.create({ data: { name: "Indeed Malaysia", type: "JOB_BOARD", platform: "indeed", isActive: true, autoImport: true, importUrl: "https://api.indeed.com/v2/jobs", costPerHire: 280, monthlyBudget: 5000, totalCandidates: 312, totalHired: 55, lastImportAt: d(0), lastImportCount: 18, notes: "High volume, good for entry-level" } }),
    prisma.sourcingChannel.create({ data: { name: "Employee Referral Program", type: "REFERRAL", platform: "internal-portal", isActive: true, autoImport: false, costPerHire: 150, monthlyBudget: 3000, totalCandidates: 89, totalHired: 34, notes: "Best conversion rate. RM 500 bonus per hire." } }),
    prisma.sourcingChannel.create({ data: { name: "TP Career Website", type: "CAREER_SITE", platform: "tp-careers", isActive: true, autoImport: true, importUrl: "https://careers.teleperformance.com.my/api", totalCandidates: 156, totalHired: 22, lastImportAt: d(0), lastImportCount: 5 } }),
    prisma.sourcingChannel.create({ data: { name: "Walk-in Center (KL)", type: "WALK_IN", platform: "kl-office", isActive: true, autoImport: false, costPerHire: 50, totalCandidates: 67, totalHired: 18, notes: "Menara Shell, KL Sentral. Mon-Sat 9AM-4PM." } }),
    prisma.sourcingChannel.create({ data: { name: "Facebook Recruitment", type: "SOCIAL_MEDIA", platform: "facebook", isActive: true, autoImport: false, costPerHire: 180, monthlyBudget: 4000, totalCandidates: 134, totalHired: 15, notes: "Good for BM-speaking candidates" } }),
    prisma.sourcingChannel.create({ data: { name: "Maukerja", type: "JOB_BOARD", platform: "maukerja", isActive: true, autoImport: false, costPerHire: 200, monthlyBudget: 2000, totalCandidates: 92, totalHired: 12, notes: "Budget-friendly local board" } }),
    prisma.sourcingChannel.create({ data: { name: "Ricebowl.my", type: "JOB_BOARD", platform: "ricebowl", isActive: false, autoImport: false, costPerHire: 320, monthlyBudget: 1500, totalCandidates: 45, totalHired: 5, notes: "Paused — testing ROI" } }),
  ]);
  console.log(`✅ Created 9 sourcing channels`);

  // ===== AUDIT LOG (demo entries) =====
  const auditEntries = [
    { entityType: "Candidate", entityId: candidates[0].id, action: "CREATED", details: JSON.stringify({ source: "JOB_BOARD", role: "CSA-EN" }), performedBy: "SYSTEM" },
    { entityType: "Candidate", entityId: candidates[3].id, action: "STAGE_CHANGED", details: JSON.stringify({ from: "SCREENING", to: "ASSESSMENT_PENDING" }), performedBy: "aisha.ta@tp.com" },
    { entityType: "Offer", entityId: offer1.id, action: "OFFER_CREATED", details: JSON.stringify({ tier: "GREEN", amount: 4500 }), performedBy: "SYSTEM" },
    { entityType: "Offer", entityId: offer1.id, action: "OFFER_AUTO_APPROVED", details: JSON.stringify({ tier: "GREEN" }), performedBy: "SYSTEM" },
    { entityType: "Offer", entityId: offer1.id, action: "OFFER_ACCEPTED", details: JSON.stringify({ by: "maria.santos@email.com" }), performedBy: "maria.santos@email.com" },
    { entityType: "Offer", entityId: offer6.id, action: "OFFER_CREATED", details: JSON.stringify({ tier: "RED", amount: 6400 }), performedBy: "SYSTEM" },
    { entityType: "Approval", entityId: offer6.id, action: "APPROVAL_SENT", details: JSON.stringify({ to: "aisha.ta@tp.com", role: "TA_LEAD" }), performedBy: "SYSTEM" },
    { entityType: "Candidate", entityId: candidates[18].id, action: "REJECTED", details: JSON.stringify({ reason: "Salary expectations too high" }), performedBy: "david.dir@tp.com" },
    { entityType: "SourcingChannel", entityId: "jobstreet", action: "IMPORT_COMPLETED", details: JSON.stringify({ count: 12 }), performedBy: "SYSTEM" },
    { entityType: "Candidate", entityId: candidates[16].id, action: "ONBOARDING_STARTED", details: JSON.stringify({ bgvStatus: "IN_PROGRESS" }), performedBy: "SYSTEM" },
  ];
  for (const entry of auditEntries) {
    await prisma.auditLog.create({ data: entry });
  }
  console.log(`✅ Created ${auditEntries.length} audit log entries`);

  console.log("\n=== 🎉 SEED COMPLETE ===\n");
  console.log("📊 Summary:");
  console.log(`   ${roles.length} Roles across 5 clients`);
  console.log(`   ${candidates.length} Candidates in various stages`);
  console.log(`   8 Offers (GREEN/AMBER/RED tiers)`);
  console.log(`   11 Approvals (pending + completed)`);
  console.log(`   9 Sourcing Channels`);
  console.log(`   ${auditEntries.length} Audit Log entries`);
  console.log("\n🔗 Pages to test:");
  console.log("   http://localhost:3000              — Landing Page");
  console.log("   http://localhost:3000/dashboard     — Dashboard");
  console.log("   http://localhost:3000/admin         — Admin Panel");
  console.log("   http://localhost:3000/sourcing      — Sourcing Hub");
  console.log("   http://localhost:3000/sourcing/cv-outreach  — CV Validation");
  console.log("   http://localhost:3000/sourcing/job-posts    — Job Posting");
  console.log("   http://localhost:3000/sourcing/content      — Content Creator");
  console.log("   http://localhost:3000/sourcing/trap         — TRAP Ads");
  console.log("   http://localhost:3000/sourcing/walkin-qr    — QR Walk-in");
  console.log("   http://localhost:3000/walkin        — Walk-in Form");
  console.log("   http://localhost:3000/ta-monitor    — TA Monitoring");
  console.log("   http://localhost:3000/interview     — Smart Interview");
  console.log("   http://localhost:3000/portal/login  — Candidate Portal");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
