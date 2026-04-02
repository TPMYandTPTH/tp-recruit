import { NextRequest, NextResponse } from "next/server";

// ─── PDF Offer Letter Generator ─────────────────────────────────
// Generates a professional TP-branded offer letter PDF using HTML → PDF conversion
// This uses the built-in approach of generating a downloadable HTML that prints as PDF

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      candidateName = "Candidate",
      role = "Customer Service Representative",
      client = "Client",
      salary = "3,000",
      currency = "MYR",
      startDate = "TBD",
      manager = "Hiring Manager",
      type = "offer-letter", // offer-letter | nda | contract
    } = body;

    const today = new Date().toLocaleDateString("en-MY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let htmlContent = "";

    if (type === "offer-letter") {
      htmlContent = generateOfferLetterHTML({
        candidateName,
        role,
        client,
        salary,
        currency,
        startDate,
        manager,
        today,
      });
    } else if (type === "nda") {
      htmlContent = generateNDAHTML({ candidateName, today });
    } else {
      htmlContent = generateOfferLetterHTML({
        candidateName,
        role,
        client,
        salary,
        currency,
        startDate,
        manager,
        today,
      });
    }

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${type}-${candidateName.replace(/\s+/g, "-").toLowerCase()}.html"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}

// ─── Offer Letter Template ──────────────────────────────────────
function generateOfferLetterHTML(data: {
  candidateName: string;
  role: string;
  client: string;
  salary: string;
  currency: string;
  startDate: string;
  manager: string;
  today: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Offer Letter — ${data.candidateName}</title>
  <style>
    @media print {
      body { margin: 0; padding: 0; }
      .no-print { display: none !important; }
      @page { margin: 0.75in; size: A4; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', -apple-system, Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      background: #f0f0f0;
    }
    .page {
      max-width: 794px;
      margin: 20px auto;
      background: white;
      padding: 60px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
      min-height: 1100px;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #4B4C6A;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    .logo-area h1 {
      font-size: 28px;
      color: #4B4C6A;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .logo-area .tagline {
      font-size: 11px;
      color: #FF0082;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
    }
    .header-info {
      text-align: right;
      font-size: 11px;
      color: #666;
    }
    .date { margin-bottom: 30px; color: #555; font-size: 14px; }
    .greeting { font-size: 15px; margin-bottom: 20px; }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #4B4C6A;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 30px 0 15px;
      padding-bottom: 5px;
      border-bottom: 1px solid #e0e0e0;
    }
    p { font-size: 14px; margin-bottom: 12px; }
    .highlight-box {
      background: #f8f7f5;
      border-left: 4px solid #FF0082;
      padding: 20px 25px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .highlight-box table { width: 100%; border-collapse: collapse; }
    .highlight-box td { padding: 8px 0; font-size: 14px; }
    .highlight-box td:first-child { font-weight: 600; color: #4B4C6A; width: 180px; }
    .highlight-box td:last-child { color: #333; }
    .benefits-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 15px 0;
    }
    .benefit-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #555;
    }
    .benefit-item::before {
      content: "✓";
      color: #FF0082;
      font-weight: 700;
      font-size: 14px;
    }
    .signature-area {
      margin-top: 50px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
    }
    .sig-block { border-top: 2px solid #4B4C6A; padding-top: 10px; }
    .sig-block .name { font-weight: 700; color: #4B4C6A; font-size: 14px; }
    .sig-block .title { font-size: 12px; color: #666; }
    .footer {
      position: absolute;
      bottom: 30px;
      left: 60px;
      right: 60px;
      text-align: center;
      font-size: 10px;
      color: #999;
      border-top: 1px solid #e0e0e0;
      padding-top: 15px;
    }
    .footer .pink { color: #FF0082; }
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #FF0082;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255,0,130,0.3);
      z-index: 100;
    }
    .print-btn:hover { background: #cc0068; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">⬇ Save as PDF</button>

  <div class="page">
    <div class="header">
      <div class="logo-area">
        <h1>Teleperformance</h1>
        <div class="tagline">Each interaction matters</div>
      </div>
      <div class="header-info">
        Teleperformance Malaysia Sdn Bhd<br>
        Level 21, Menara TP<br>
        Kuala Lumpur, Malaysia<br>
        <span style="color:#FF0082">recruitment@tp-malaysia.com</span>
      </div>
    </div>

    <div class="date">${data.today}</div>

    <div class="greeting">
      <p>Dear <strong>${data.candidateName}</strong>,</p>
    </div>

    <p>
      We are pleased to offer you the position of <strong>${data.role}</strong> with
      Teleperformance Malaysia, supporting our <strong>${data.client}</strong> account.
      After careful review of your qualifications, we believe you will be an excellent
      addition to our team.
    </p>

    <div class="section-title">Position Details</div>

    <div class="highlight-box">
      <table>
        <tr><td>Position</td><td>${data.role}</td></tr>
        <tr><td>Account / Client</td><td>${data.client}</td></tr>
        <tr><td>Monthly Salary</td><td>${data.currency} ${data.salary}</td></tr>
        <tr><td>Start Date</td><td>${data.startDate}</td></tr>
        <tr><td>Reporting To</td><td>${data.manager}</td></tr>
        <tr><td>Employment Type</td><td>Full-time, Permanent</td></tr>
        <tr><td>Work Location</td><td>TP Malaysia — Kuala Lumpur</td></tr>
        <tr><td>Probation Period</td><td>3 months</td></tr>
      </table>
    </div>

    <div class="section-title">Benefits Package</div>

    <div class="benefits-grid">
      <div class="benefit-item">Medical & Dental Coverage</div>
      <div class="benefit-item">Annual Leave (14 days)</div>
      <div class="benefit-item">EPF & SOCSO Contributions</div>
      <div class="benefit-item">Performance Bonuses</div>
      <div class="benefit-item">Training & Development</div>
      <div class="benefit-item">Career Growth Programs</div>
      <div class="benefit-item">Employee Assistance Program</div>
      <div class="benefit-item">Transportation Allowance</div>
    </div>

    <div class="section-title">Next Steps</div>

    <p>
      Please confirm your acceptance of this offer by signing below and returning
      this letter by <strong>${data.startDate}</strong>. Upon acceptance, our HR team
      will reach out with onboarding details including documentation requirements,
      orientation schedule, and training program information.
    </p>

    <p>
      This offer is contingent upon successful completion of background verification
      and provision of all required employment documents.
    </p>

    <div class="signature-area">
      <div class="sig-block">
        <div class="name">${data.manager}</div>
        <div class="title">Recruitment Manager<br>Teleperformance Malaysia</div>
      </div>
      <div class="sig-block">
        <div class="name">${data.candidateName}</div>
        <div class="title">Candidate Acceptance<br>Date: _______________</div>
      </div>
    </div>

    <div class="footer">
      <strong>Teleperformance Malaysia Sdn Bhd</strong> (Registration No. 200301XXXXX)<br>
      Level 21, Menara TP, Kuala Lumpur 50450 | Tel: +60 3-XXXX XXXX<br>
      <span class="pink">www.teleperformance.com</span> | This document is confidential
    </div>
  </div>
</body>
</html>`;
}

// ─── NDA Template ───────────────────────────────────────────────
function generateNDAHTML(data: { candidateName: string; today: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NDA — ${data.candidateName}</title>
  <style>
    @media print { body { margin: 0; } .no-print { display: none !important; } @page { margin: 0.75in; size: A4; } }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.7; background: #f0f0f0; }
    .page { max-width: 794px; margin: 20px auto; background: white; padding: 60px; box-shadow: 0 2px 20px rgba(0,0,0,0.1); min-height: 1100px; position: relative; }
    .header { border-bottom: 3px solid #4B4C6A; padding-bottom: 15px; margin-bottom: 30px; }
    .header h1 { font-size: 24px; color: #4B4C6A; }
    .header .sub { font-size: 11px; color: #FF0082; text-transform: uppercase; letter-spacing: 2px; }
    h2 { font-size: 18px; color: #4B4C6A; margin: 25px 0 15px; text-align: center; }
    p, li { font-size: 13px; margin-bottom: 10px; }
    ol { padding-left: 25px; }
    ol li { margin-bottom: 15px; }
    .sig-area { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .sig { border-top: 2px solid #4B4C6A; padding-top: 8px; margin-top: 60px; }
    .sig .name { font-weight: 700; color: #4B4C6A; }
    .sig .role { font-size: 12px; color: #666; }
    .print-btn { position: fixed; top: 20px; right: 20px; background: #FF0082; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(255,0,130,0.3); }
    .footer { position: absolute; bottom: 30px; left: 60px; right: 60px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">⬇ Save as PDF</button>
  <div class="page">
    <div class="header">
      <h1>Teleperformance</h1>
      <div class="sub">Each interaction matters</div>
    </div>
    <h2>Non-Disclosure Agreement</h2>
    <p>Date: ${data.today}</p>
    <p>This Non-Disclosure Agreement ("Agreement") is entered into between <strong>Teleperformance Malaysia Sdn Bhd</strong> ("Company") and <strong>${data.candidateName}</strong> ("Employee").</p>
    <ol>
      <li><strong>Confidential Information.</strong> Employee agrees that all information relating to Company's clients, business operations, technical data, trade secrets, customer information, and proprietary processes are confidential.</li>
      <li><strong>Non-Disclosure.</strong> Employee shall not disclose, publish, or otherwise reveal any Confidential Information to any third party during or after employment without prior written consent from the Company.</li>
      <li><strong>Client Data Protection.</strong> Employee acknowledges that client data processed in the course of work is subject to strict data protection regulations. Any unauthorized access, copying, or distribution of client data is strictly prohibited.</li>
      <li><strong>Return of Materials.</strong> Upon termination of employment, Employee shall return all documents, files, and materials containing Confidential Information.</li>
      <li><strong>Term.</strong> This Agreement shall remain in effect during the period of employment and for a period of two (2) years after termination.</li>
      <li><strong>Remedies.</strong> Employee acknowledges that any breach may cause irreparable harm and that the Company shall be entitled to seek injunctive relief in addition to other remedies.</li>
      <li><strong>Governing Law.</strong> This Agreement shall be governed by the laws of Malaysia.</li>
    </ol>
    <div class="sig-area">
      <div>
        <div class="sig"><div class="name">Authorized Signatory</div><div class="role">Teleperformance Malaysia<br>Date: _______________</div></div>
      </div>
      <div>
        <div class="sig"><div class="name">${data.candidateName}</div><div class="role">Employee<br>Date: _______________</div></div>
      </div>
    </div>
    <div class="footer"><strong>Teleperformance Malaysia Sdn Bhd</strong> | Confidential Document</div>
  </div>
</body>
</html>`;
}
