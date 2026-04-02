#!/usr/bin/env python3
"""Seed the SQLite database with comprehensive demo data."""
import sqlite3
import uuid
import json
from datetime import datetime, timedelta

DB_PATH = "prisma/dev.db"

def cuid():
    return "cl" + uuid.uuid4().hex[:23]

def dt(days_ago=0):
    return (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%dT%H:%M:%S.000Z")

def dt_future(days=0):
    return (datetime.now() + timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%S.000Z")

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

print("🌱 Seeding database with comprehensive demo data...\n")

# Clean existing data
for table in ["Approval", "Offer", "Candidate", "ScreeningQuestion", "SourcingChannel", "AuditLog", "OtpCode", "Role"]:
    c.execute(f"DELETE FROM {table}")
print("Cleaned existing data.\n")

# ===== ROLES =====
roles = []
role_data = [
    ("Customer Service Agent - EN", "TechCorp Global", "Q2 2026 Support", 4800, 5500, 6200, 5400, "STANDARD", "HUMAN_INTERVIEW", 50, 28),
    ("Customer Service Agent - BM", "TechCorp Global", "Q2 2026 Support", 4500, 5200, 5900, 5100, "PRIORITY", "AI_INTERVIEW", 30, 12),
    ("Technical Support Agent - EN", "CloudPlatform Inc", "Tier 1 Support", 5500, 6400, 7200, 6300, "CRITICAL", "HUMAN_INTERVIEW", 20, 5),
    ("Sales Support Agent", "RetailMax", "Holiday Peak 2026", 4200, 4800, 5400, None, "STANDARD", "NO_INTERVIEW", 100, 65),
    ("Customer Service Agent - Mandarin", "TechCorp Global", "CN Support Q2", 5000, 5800, 6500, 5700, "CRITICAL", "HUMAN_INTERVIEW", 25, 8),
    ("Technical Support Agent - Japanese", "Gaming Co", "APAC Gaming Support", 5500, 7000, 8000, 6800, "CRITICAL", "HUMAN_INTERVIEW", 10, 2),
    ("Sales Agent - BM", "Telco Provider", "Outbound Sales MY", 3000, 4000, 4500, 3800, "STANDARD", "HUMAN_INTERVIEW", 40, 22),
    ("Customer Service Agent - Korean", "Cosmetics Brand", "K-Beauty Support", 5200, 6200, 7000, 6000, "PRIORITY", "HUMAN_INTERVIEW", 8, 1),
]
for title, client, campaign, smin, smid, smax, market, crit, imode, total, filled in role_data:
    rid = cuid()
    roles.append(rid)
    c.execute("""INSERT INTO Role (id, title, client, campaign, department, salaryMin, salaryMid, salaryMax, currency, marketMedian, criticality, interviewMode, totalPositions, filledPositions, createdAt, updatedAt)
    VALUES (?,?,?,?,'Operations',?,?,?,'MYR',?,?,?,?,?,?,?)""",
    (rid, title, client, campaign, smin, smid, smax, market, crit, imode, total, filled, dt(30), dt(0)))
print(f"✅ Created {len(roles)} roles")

# ===== SCREENING QUESTIONS =====
q_data = [
    ("ELIGIBILITY", "Are you 18 years of age or older?", "YES_NO", None, 1, 1, "false"),
    ("ELIGIBILITY", "Are you legally authorized to work in Malaysia?", "YES_NO", None, 1, 2, "false"),
    ("ELIGIBILITY", "Are you available to start within the next 30 days?", "YES_NO", None, 1, 3, None),
    ("SKILLS", "How would you rate your English proficiency?", "MULTIPLE_CHOICE", json.dumps(["Native / Bilingual","Advanced (C1-C2)","Intermediate (B1-B2)","Basic (A1-A2)"]), 1, 4, "Basic (A1-A2)"),
    ("SKILLS", "How many years of customer service experience do you have?", "MULTIPLE_CHOICE", json.dumps(["No experience","Less than 1 year","1-3 years","3-5 years","More than 5 years"]), 1, 5, None),
    ("SKILLS", "What is your typing speed (words per minute)?", "MULTIPLE_CHOICE", json.dumps(["Below 25 WPM","25-40 WPM","40-60 WPM","Above 60 WPM"]), 1, 6, None),
    ("SALARY", "What is your expected monthly salary (MYR)?", "SALARY_INPUT", None, 1, 7, None),
]
for cat, q, qtype, opts, req, order, fail in q_data:
    c.execute("""INSERT INTO ScreeningQuestion (id, roleId, category, question, type, options, isRequired, failValue, 'order', isActive, createdAt)
    VALUES (?,NULL,?,?,?,?,?,?,?,1,?)""",
    (cuid(), cat, q, qtype, opts, req, fail, order, dt(60)))
print(f"✅ Created {len(q_data)} screening questions")

# ===== 20 CANDIDATES =====
cands = []
cand_data = [
    # (token, first, last, email, phone, roleIdx, source, salary, stage, screenDays, assessDays, intSchedDays, intPassDays, onboardDays, bgv, docs)
    ("tok-001", "Sarah", "Ahmad", "sarah.ahmad@email.com", "+60123456789", 0, "JOB_BOARD", 5200, "SCREENING", None, None, None, None, None, None, 0),
    ("tok-002", "Ahmad", "Razak", "ahmad.razak@email.com", "+60178901234", 6, "WALK_IN", 3500, "SCREENING", None, None, None, None, None, None, 0),
    ("tok-003", "Priya", "Devi", "priya.devi@email.com", "+60162345678", 0, "SOCIAL_MEDIA", 5000, "SCREENING", None, None, None, None, None, None, 0),
    ("tok-004", "Ali", "Hassan", "ali.hassan@email.com", "+60145678901", 1, "PORTAL", 5000, "ASSESSMENT_PENDING", 5, None, None, None, None, None, 0),
    ("tok-005", "Nurul", "Izzah", "nurul.izzah@email.com", "+60189012345", 4, "JOB_BOARD", 5500, "ASSESSMENT_PENDING", 3, None, None, None, None, None, 0),
    ("tok-006", "Fatimah", "Zahra", "fatimah.zahra@email.com", "+60134567890", 0, "SOCIAL_MEDIA", 5300, "ASSESSMENT_IN_PROGRESS", 7, None, None, None, None, None, 0),
    ("tok-007", "Lee", "Jun Wei", "junwei.lee@email.com", "+60185678901", 4, "REFERRAL", 5600, "ASSESSMENT_IN_PROGRESS", 6, None, None, None, None, None, 0),
    ("tok-008", "Aisha", "Rahman", "aisha.rahman@email.com", "+60156789012", 1, "JOB_BOARD", 5100, "INTERVIEW_SCHEDULED", 14, 7, -3, None, None, None, 0),
    ("tok-009", "Tanaka", "Yuki", "tanaka.yuki@email.com", "+60114567890", 5, "PORTAL", 7000, "INTERVIEW_SCHEDULED", 10, 5, -1, None, None, None, 0),
    ("tok-010", "James", "Chen", "james.chen@email.com", "+60198765432", 0, "REFERRAL", 5900, "SELECTED", 21, 14, None, 3, None, None, 0),
    ("tok-011", "Park", "Min-jun", "park.minjun@email.com", "+60198901234", 7, "PORTAL", 6500, "SELECTED", 18, 12, None, 2, None, None, 0),
    ("tok-012", "Lim", "Wei Ling", "sarah.lim@email.com", "+60123456700", 4, "JOB_BOARD", 5400, "SELECTED", 15, 10, None, 2, None, None, 0),
    ("tok-013", "Wei", "Lin", "wei.lin@email.com", "+60167890123", 2, "REFERRAL", 6200, "OFFER_SENT", 21, 14, None, 5, None, None, 0),
    ("tok-014", "Maria", "Garcia", "maria.garcia@email.com", "+60145670123", 6, "WALK_IN", 3800, "OFFER_SENT", 18, 10, None, 4, None, None, 0),
    ("tok-015", "Maria", "Santos", "maria.santos@email.com", "+60178901234", 3, "WALK_IN", 4500, "OFFER_ACCEPTED", 28, 21, None, 10, 2, None, 0),
    ("tok-016", "Siti", "Nurhaliza", "siti.nur@email.com", "+60156780123", 1, "JOB_BOARD", 4900, "OFFER_ACCEPTED", 30, 22, None, 12, None, None, 0),
    ("tok-017", "Raj", "Patel", "raj.patel@email.com", "+60189012345", 3, "PORTAL", 4600, "ONBOARDING", 35, 28, None, 14, 5, "IN_PROGRESS", 0),
    ("tok-018", "Chen", "Mei Ling", "chen.meiling@email.com", "+60134560123", 4, "REFERRAL", 5600, "ONBOARDING", 40, 30, None, 18, 3, "PASSED", 1),
    ("tok-019", "Kenji", "Tanaka", "kenji.tanaka@email.com", "+60114560123", 2, "WALK_IN", 8500, "REJECTED", 14, 7, None, None, None, None, 0),
    ("tok-020", "Mohd", "Amin", "mohd.amin@email.com", "+60167891234", 0, "SOCIAL_MEDIA", 7000, "REJECTED", 10, None, None, None, None, None, 0),
]
for tok, fn, ln, email, phone, ri, src, sal, stage, scr, ass, intSch, intPass, onb, bgv, docs in cand_data:
    cid = cuid()
    cands.append(cid)
    scrAt = dt(scr) if scr else None
    assAt = dt(ass) if ass else None
    intSchAt = dt_future(-intSch) if intSch else None  # negative = future
    intPassAt = dt(intPass) if intPass else None
    onbAt = dt(onb) if onb else None
    c.execute("""INSERT INTO Candidate (id, portalToken, firstName, lastName, email, phone, roleId, source, icimsCandidateId, expectedSalary, stage, stageUpdatedAt, screeningData, screeningPassedAt, assessmentScore, assessmentPassedAt, assessmentLink, interviewScore, interviewNotes, interviewPassedAt, interviewScheduledAt, onboardingStartedAt, bgvStatus, documentsUploaded, createdAt, updatedAt)
    VALUES (?,?,?,?,?,?,?,?,NULL,?,?,?,NULL,?,NULL,?,NULL,NULL,NULL,?,?,?,?,?,?,?)""",
    (cid, tok, fn, ln, email, phone, roles[ri], src, sal, stage, dt(scr or 1), scrAt, assAt, intPassAt, intSchAt, onbAt, bgv, docs, dt(scr or 1), dt(0)))
print(f"✅ Created {len(cands)} candidates")

# ===== OFFERS =====
offers = []
offer_data = [
    # (candIdx, round, salary, tier, base, critAdj, fillAdj, mktAdj, appStatus, status, calcNotes, aiSummary, sentDays, respDays, decReason, decCat, counter)
    (14, 1, 4500, "GREEN", 4500, 0, 0, 0, "AUTO_APPROVED", "ACCEPTED", "Salary ≤ midpoint (4800). Auto-approved per GREEN tier.", None, 5, 3, None, None, None),
    (15, 1, 4900, "GREEN", 4900, 0, 0, 0, "AUTO_APPROVED", "ACCEPTED", "Salary ≤ midpoint (5200). Auto-approved per GREEN tier.", None, 8, 6, None, None, None),
    (12, 1, 6200, "GREEN", 6200, 0, 0, 0, "AUTO_APPROVED", "SENT", "Salary ≤ midpoint (6400). Auto-approved.", None, 1, None, None, None, None),
    (13, 1, 4200, "AMBER", 3800, 0, 200, 200, "PENDING", "PENDING_APPROVAL", "Above midpoint (4000) but below max (4500). AMBER — parallel approval.", "Walk-in with sales BG. RM 4,200 is 5% above mid, justified by fill rate.", None, None, None, None, None),
    (16, 1, 5000, "AMBER", 4600, 0, 200, 200, "APPROVED", "ACCEPTED", "Above midpoint (4800). Approved via parallel.", None, 8, 6, None, None, None),
    (9, 1, 6400, "RED", 5900, 0, 300, 200, "PENDING", "PENDING_APPROVAL", "Above max (6200). RED — sequential: TA Lead → Director → COO.", "Strong referral, 3yr BPO. RM 6,400 exceeds max by 200. Low fill rate (56%).", None, None, None, None, None),
    (18, 1, 7000, "RED", 6800, 200, 0, 0, "APPROVED", "DECLINED", "Critical role, above max. Sequential approval completed.", None, 10, 8, "Expected higher salary", "SALARY", None),
    (17, 1, 5600, "GREEN", 5600, 0, 0, 0, "AUTO_APPROVED", "ACCEPTED", "Salary ≤ midpoint (5800). Auto-approved.", None, 6, 4, None, None, None),
]
for ci, rnd, sal, tier, base, ca, fa, ma, appSt, st, calc, ai, sentD, respD, decR, decC, ctr in offer_data:
    oid = cuid()
    offers.append(oid)
    sentAt = dt(sentD) if sentD else None
    respAt = dt(respD) if respD else None
    c.execute("""INSERT INTO Offer (id, candidateId, round, offeredSalary, tier, baseSalary, criticalityAdj, fillRateAdj, marketAdj, calculationNotes, approvalStatus, aiSummary, status, respondedAt, declineReason, declineCategory, counterAmount, offerLetterUrl, sentAt, createdAt, updatedAt)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL,?,?,?)""",
    (oid, cands[ci], rnd, sal, tier, base, ca, fa, ma, calc, appSt, ai, st, respAt, decR, decC, ctr, sentAt, dt(sentD or 2), dt(0)))
print(f"✅ Created {len(offers)} offers")

# ===== APPROVALS =====
appr_count = 0
appr_data = [
    # (offerIdx, email, name, role, status, decidedDays, sentDays, slaDays, notes)
    (3, "aisha.ta@tp.com", "Aisha Binti Rahman", "TA_LEAD", "PENDING", None, 1, -1, None),
    (3, "david.dir@tp.com", "David Tan", "DIRECTOR", "PENDING", None, 1, -2, None),
    (4, "aisha.ta@tp.com", "Aisha Binti Rahman", "TA_LEAD", "APPROVED", 9, 10, 8, "Good candidate. Approved."),
    (4, "david.dir@tp.com", "David Tan", "DIRECTOR", "APPROVED", 9, 10, 8, None),
    (5, "aisha.ta@tp.com", "Aisha Binti Rahman", "TA_LEAD", "APPROVED", 1, 2, 0, "Strong referral. Worth the premium."),
    (5, "david.dir@tp.com", "David Tan", "DIRECTOR", "PENDING", None, 1, -1, None),
    (5, "coo@tp.com", "Sarah Lee (COO)", "COO", "PENDING", None, 0, -3, None),
    (6, "aisha.ta@tp.com", "Aisha Binti Rahman", "TA_LEAD", "APPROVED", 12, 13, 11, None),
    (6, "david.dir@tp.com", "David Tan", "DIRECTOR", "APPROVED", 11, 12, 10, None),
    (6, "coo@tp.com", "Sarah Lee (COO)", "COO", "APPROVED", 11, 11, 9, None),
]
for oi, email, name, role, status, decD, sentD, slaD, notes in appr_data:
    decAt = dt(decD) if decD else None
    slaAt = dt_future(-slaD) if slaD and slaD < 0 else dt(slaD) if slaD else dt(-2)
    c.execute("""INSERT INTO Approval (id, offerId, approverEmail, approverName, approverRole, status, decidedAt, notes, sentAt, slaDeadline, reminded, escalated, createdAt, updatedAt)
    VALUES (?,?,?,?,?,?,?,?,?,?,0,0,?,?)""",
    (cuid(), offers[oi], email, name, role, status, decAt, notes, dt(sentD), slaAt, dt(sentD), dt(0)))
    appr_count += 1
print(f"✅ Created {appr_count} approvals")

# ===== SOURCING CHANNELS =====
ch_data = [
    ("JobStreet Malaysia", "JOB_BOARD", "jobstreet", 1, 1, "https://api.jobstreet.com.my/v1/applications", None, None, 350, 8000, 245, 42, 0, 12, "Primary job board for MY market", "JobStreet Rep", "enterprise@jobstreet.com.my"),
    ("LinkedIn Recruiter", "SOCIAL_MEDIA", "linkedin", 1, 0, None, None, None, 520, 12000, 178, 28, 1, 8, "Best for senior/technical roles", "LinkedIn CSM", None),
    ("Indeed Malaysia", "JOB_BOARD", "indeed", 1, 1, "https://api.indeed.com/v2/jobs", None, None, 280, 5000, 312, 55, 0, 18, "High volume, good for entry-level", None, None),
    ("Employee Referral Program", "REFERRAL", "internal-portal", 1, 0, None, None, None, 150, 3000, 89, 34, None, None, "Best conversion rate. RM 500 bonus per hire.", None, None),
    ("TP Career Website", "CAREER_SITE", "tp-careers", 1, 1, "https://careers.teleperformance.com.my/api", None, None, None, None, 156, 22, 0, 5, None, None, None),
    ("Walk-in Center (KL)", "WALK_IN", "kl-office", 1, 0, None, None, None, 50, None, 67, 18, None, None, "Menara Shell, KL Sentral. Mon-Sat 9AM-4PM.", None, None),
    ("Facebook Recruitment", "SOCIAL_MEDIA", "facebook", 1, 0, None, None, None, 180, 4000, 134, 15, None, None, "Good for BM-speaking candidates", None, None),
    ("Maukerja", "JOB_BOARD", "maukerja", 1, 0, None, None, None, 200, 2000, 92, 12, None, None, "Budget-friendly local board", None, None),
    ("Ricebowl.my", "JOB_BOARD", "ricebowl", 0, 0, None, None, None, 320, 1500, 45, 5, None, None, "Paused — testing ROI", None, None),
]
for name, typ, plat, active, auto, url, key, config, cph, budget, tc, th, liD, lic, notes, cp, ce in ch_data:
    liAt = dt(liD) if liD is not None else None
    c.execute("""INSERT INTO SourcingChannel (id, name, type, platform, isActive, autoImport, importUrl, apiKey, config, costPerHire, monthlyBudget, totalCandidates, totalHired, lastImportAt, lastImportCount, notes, contactPerson, contactEmail, createdAt, updatedAt)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    (cuid(), name, typ, plat, active, auto, url, key, config, cph, budget, tc, th, liAt, lic or 0, notes, cp, ce, dt(60), dt(0)))
print(f"✅ Created {len(ch_data)} sourcing channels")

# ===== AUDIT LOG =====
audit = [
    ("Candidate", cands[0], "CREATED", json.dumps({"source":"JOB_BOARD","role":"CSA-EN"}), "SYSTEM"),
    ("Candidate", cands[3], "STAGE_CHANGED", json.dumps({"from":"SCREENING","to":"ASSESSMENT_PENDING"}), "aisha.ta@tp.com"),
    ("Offer", offers[0], "OFFER_CREATED", json.dumps({"tier":"GREEN","amount":4500}), "SYSTEM"),
    ("Offer", offers[0], "OFFER_AUTO_APPROVED", json.dumps({"tier":"GREEN"}), "SYSTEM"),
    ("Offer", offers[0], "OFFER_ACCEPTED", json.dumps({"by":"maria.santos@email.com"}), "maria.santos@email.com"),
    ("Offer", offers[5], "OFFER_CREATED", json.dumps({"tier":"RED","amount":6400}), "SYSTEM"),
    ("Approval", offers[5], "APPROVAL_SENT", json.dumps({"to":"aisha.ta@tp.com","role":"TA_LEAD"}), "SYSTEM"),
    ("Candidate", cands[18], "REJECTED", json.dumps({"reason":"Salary expectations too high"}), "david.dir@tp.com"),
    ("SourcingChannel", "jobstreet", "IMPORT_COMPLETED", json.dumps({"count":12}), "SYSTEM"),
    ("Candidate", cands[16], "ONBOARDING_STARTED", json.dumps({"bgvStatus":"IN_PROGRESS"}), "SYSTEM"),
]
for etype, eid, action, details, by in audit:
    c.execute("""INSERT INTO AuditLog (id, entityType, entityId, action, details, performedBy, createdAt)
    VALUES (?,?,?,?,?,?,?)""", (cuid(), etype, eid, action, details, by, dt(1)))
print(f"✅ Created {len(audit)} audit log entries")

conn.commit()
conn.close()

print("\n=== 🎉 SEED COMPLETE ===\n")
print(f"📊 Summary:")
print(f"   {len(roles)} Roles across 5 clients")
print(f"   {len(cands)} Candidates in various stages")
print(f"   {len(offers)} Offers (GREEN/AMBER/RED tiers)")
print(f"   {appr_count} Approvals (pending + completed)")
print(f"   {len(ch_data)} Sourcing Channels")
print(f"   {len(audit)} Audit Log entries")
