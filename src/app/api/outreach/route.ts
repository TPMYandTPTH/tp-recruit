import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/outreach — generate outreach messages for candidates
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { candidateName, roleTitle, client, language, channel, tone, cvScore } = body as {
    candidateName: string;
    roleTitle: string;
    client: string;
    language: string;  // "EN", "BM", "ZH", "JA", "KO", "AR", "HI", "TH"
    channel: string;   // "email", "whatsapp", "linkedin", "sms"
    tone: string;      // "professional", "friendly", "urgent"
    cvScore?: number;
  };

  const messages = generateOutreach({
    candidateName, roleTitle, client, language, channel, tone, cvScore
  });

  return NextResponse.json({ messages });
}

function generateOutreach(params: {
  candidateName: string; roleTitle: string; client: string;
  language: string; channel: string; tone: string; cvScore?: number;
}) {
  const { candidateName, roleTitle, client, language, channel, tone, cvScore } = params;
  const firstName = candidateName.split(" ")[0];
  const isHighMatch = (cvScore || 0) >= 70;

  const templates: Record<string, Record<string, Record<string, { subject?: string; body: string }>>> = {
    EN: {
      email: {
        professional: {
          subject: `Exciting Career Opportunity at Teleperformance — ${roleTitle}`,
          body: `Dear ${candidateName},\n\nI hope this message finds you well. I am reaching out from Teleperformance Malaysia regarding an exciting career opportunity that aligns with your professional background.\n\nWe are currently hiring for the position of ${roleTitle} supporting ${client}. ${isHighMatch ? "Your profile stands out as an excellent match for this role." : "We believe your skills could be a great addition to our team."}\n\nKey highlights:\n• Competitive salary package\n• Career growth & development programs\n• Modern office in KL/Cyberjaya\n• Medical & dental benefits\n\nWould you be open to a brief conversation to discuss this opportunity?\n\nBest regards,\nTalent Acquisition Team\nTeleperformance Malaysia`
        },
        friendly: {
          subject: `Hey ${firstName}! 🎯 ${roleTitle} role at TP Malaysia`,
          body: `Hi ${firstName}! 👋\n\nHow's it going? I came across your profile and thought you'd be a great fit for something we have at Teleperformance Malaysia!\n\nWe're looking for a ${roleTitle} to join our ${client} campaign. ${isHighMatch ? "Honestly, your background is exactly what we need!" : "I think your skills could really shine here!"}\n\nHere's what's cool about this role:\n✨ Great salary + benefits\n🚀 Real career growth\n🏢 Awesome work culture\n🎯 Start ASAP!\n\nInterested? Just reply and I'll set up a quick chat!\n\nCheers,\nTP Malaysia Talent Team`
        },
        urgent: {
          subject: `⚡ Urgent: ${roleTitle} — Immediate Start at TP Malaysia`,
          body: `Dear ${candidateName},\n\nWe have an urgent hiring need for ${roleTitle} at Teleperformance Malaysia, supporting ${client}. We are looking to fill this position immediately.\n\n${isHighMatch ? "Your profile is a strong match and we'd like to fast-track your application." : "We believe you could be a strong candidate for this role."}\n\n🔥 Immediate start date\n💰 Competitive compensation\n📋 Fast-track hiring process (can complete in 48 hours)\n\nPlease respond at your earliest convenience if interested.\n\nBest regards,\nTP Malaysia Recruitment`
        }
      },
      whatsapp: {
        professional: {
          body: `Hello ${candidateName}, this is from Teleperformance Malaysia Talent Acquisition. We have an open position for ${roleTitle} (${client}) and your profile caught our attention. Would you be interested in learning more? We offer competitive salary, career growth, and great benefits. Please let us know if you'd like to schedule a brief discussion.`
        },
        friendly: {
          body: `Hey ${firstName}! 😊 This is from TP Malaysia! We're hiring for ${roleTitle} and I think you'd be amazing for it! 🎯\n\n✅ Great pay\n✅ Cool team\n✅ Career growth\n\nInterested? Reply "YES" and I'll share more details! 🚀`
        },
        urgent: {
          body: `Hi ${candidateName}! ⚡ URGENT HIRING at TP Malaysia — ${roleTitle} for ${client}. Immediate start, fast-track process. Interested? Reply now and we can schedule your interview within 24 hours! 🔥`
        }
      },
      linkedin: {
        professional: {
          subject: `${roleTitle} Opportunity at Teleperformance Malaysia`,
          body: `Hi ${firstName},\n\nI came across your LinkedIn profile and was impressed by your background. I'm reaching out from Teleperformance Malaysia about our ${roleTitle} position supporting ${client}.\n\n${isHighMatch ? "Your experience is a strong match for what we're looking for." : "I believe your skills align well with this opportunity."}\n\nI'd love to share more details. Would you be open to a quick chat?\n\nBest,\nTP Malaysia Talent Acquisition`
        },
        friendly: {
          subject: `Quick question about your career goals 🎯`,
          body: `Hey ${firstName}! 👋\n\nLove your profile! Quick one — we're growing our team at TP Malaysia and looking for a ${roleTitle}. Think it could be a great next step for you.\n\nHappy to chat more if you're curious! No pressure at all.\n\nCheers! 😊`
        },
        urgent: {
          subject: `Urgent: ${roleTitle} — TP Malaysia`,
          body: `Hi ${firstName},\n\nWe're urgently hiring for ${roleTitle} at TP Malaysia. Fast-track process, competitive package. Your profile looks like a match. Interested in a quick call this week?\n\nBest,\nTP Talent Team`
        }
      },
      sms: {
        professional: {
          body: `[TP Malaysia] Hi ${firstName}, we're hiring ${roleTitle} (${client}). Competitive salary + benefits. Interested? Reply YES or visit careers.tp.com`
        },
        friendly: {
          body: `Hey ${firstName}! 🎉 TP Malaysia is hiring! ${roleTitle} role — great pay, cool team. Reply YES to learn more! 🚀`
        },
        urgent: {
          body: `⚡ URGENT: ${firstName}, ${roleTitle} at TP Malaysia — immediate start! Reply YES for fast-track interview. Call: 03-XXXX-XXXX`
        }
      }
    },
    BM: {
      email: {
        professional: {
          subject: `Peluang Kerjaya di Teleperformance Malaysia — ${roleTitle}`,
          body: `Yang dihormati ${candidateName},\n\nSaya ingin menghubungi anda dari Teleperformance Malaysia mengenai peluang kerjaya yang menarik.\n\nKami sedang mencari calon untuk jawatan ${roleTitle} yang menyokong ${client}.\n\nKelebihan:\n• Pakej gaji yang kompetitif\n• Program pembangunan kerjaya\n• Pejabat moden di KL/Cyberjaya\n• Manfaat perubatan & pergigian\n\nAdakah anda berminat untuk berbincang mengenai peluang ini?\n\nSekian, terima kasih.\nPasukan Perekrutan\nTeleperformance Malaysia`
        },
        friendly: {
          subject: `Hai ${firstName}! 🎯 Jawatan ${roleTitle} di TP Malaysia`,
          body: `Hai ${firstName}! 👋\n\nApa khabar? Saya jumpa profil anda dan rasa anda sesuai untuk jawatan di Teleperformance Malaysia!\n\nKami cari ${roleTitle} untuk kempen ${client}.\n\n✨ Gaji menarik + manfaat\n🚀 Peluang kerjaya\n🏢 Budaya kerja yang hebat\n\nBerminat? Balas je dan kita boleh berbincang!\n\nTerima kasih,\nPasukan TP Malaysia`
        },
        urgent: {
          subject: `⚡ Segera: ${roleTitle} — TP Malaysia`,
          body: `${candidateName},\n\nKami memerlukan calon segera untuk ${roleTitle} di TP Malaysia. Proses pengambilan pantas — boleh siap dalam 48 jam.\n\n🔥 Mula segera\n💰 Gaji kompetitif\n📋 Proses pantas\n\nSila hubungi kami segera.\n\nTP Malaysia`
        }
      },
      whatsapp: {
        professional: { body: `Salam ${candidateName}, ini dari Teleperformance Malaysia. Kami ada kekosongan untuk ${roleTitle} (${client}). Gaji kompetitif dan manfaat menarik. Berminat? Sila maklumkan.` },
        friendly: { body: `Hai ${firstName}! 😊 TP Malaysia sedang mengambil pekerja! Jawatan: ${roleTitle} 🎯\n\n✅ Gaji best\n✅ Team cool\n✅ Kerjaya growth\n\nBerminat? Balas "YA"! 🚀` },
        urgent: { body: `⚡ SEGERA! ${firstName}, TP Malaysia perlukan ${roleTitle} sekarang! Proses pantas. Balas segera! 🔥` }
      },
      linkedin: {
        professional: { subject: `Peluang ${roleTitle} di TP Malaysia`, body: `Hai ${firstName}, profil anda menarik perhatian kami. Kami sedang mencari ${roleTitle} di TP Malaysia. Berminat untuk berbincang?` },
        friendly: { subject: `Hai ${firstName}! 🎯`, body: `Hey! Profil anda menarik! Kami ada jawatan ${roleTitle} di TP Malaysia yang mungkin sesuai. Jom chat? 😊` },
        urgent: { subject: `Segera: ${roleTitle}`, body: `${firstName}, kami perlukan ${roleTitle} segera di TP Malaysia. Berminat? Jom bincang minggu ini!` }
      },
      sms: {
        professional: { body: `[TP Malaysia] ${firstName}, kekosongan ${roleTitle} (${client}). Gaji kompetitif. Berminat? Balas YA.` },
        friendly: { body: `Hai ${firstName}! 🎉 TP Malaysia cari ${roleTitle}! Gaji best! Balas YA! 🚀` },
        urgent: { body: `⚡ SEGERA: ${firstName}, ${roleTitle} di TP Malaysia. Mula segera! Balas YA.` }
      }
    },
    ZH: {
      email: {
        professional: {
          subject: `Teleperformance马来西亚 — ${roleTitle}职位机会`,
          body: `${candidateName} 您好，\n\n我是Teleperformance马来西亚招聘团队的成员。我们目前正在招聘${roleTitle}职位，支持${client}项目。\n\n职位亮点：\n• 有竞争力的薪资\n• 职业发展机会\n• 现代化办公环境\n• 医疗和牙科福利\n\n如果您有兴趣，请回复此邮件。\n\n此致，\nTP马来西亚招聘团队`
        },
        friendly: {
          subject: `嗨 ${firstName}！🎯 TP马来西亚招聘中`,
          body: `嗨 ${firstName}！👋\n\n看到您的简历觉得很不错！TP马来西亚正在招聘${roleTitle}哦！\n\n✨ 薪资福利好\n🚀 发展空间大\n🏢 工作环境棒\n\n有兴趣聊聊吗？回复即可！😊`
        },
        urgent: {
          subject: `⚡ 紧急招聘：${roleTitle}`,
          body: `${candidateName}您好，\n\nTP马来西亚紧急招聘${roleTitle}。可立即上岗，快速面试流程。\n\n请尽快回复！\nTP马来西亚`
        }
      },
      whatsapp: {
        professional: { body: `您好 ${candidateName}，这是Teleperformance马来西亚。我们正在招聘${roleTitle}（${client}）。薪资福利优厚。有兴趣请回复。` },
        friendly: { body: `嗨 ${firstName}！😊 TP马来西亚招聘中！${roleTitle} 🎯 薪资好！回复"是"了解详情！🚀` },
        urgent: { body: `⚡ 紧急！${firstName}，TP马来西亚需要${roleTitle}！立即上岗！请回复！🔥` }
      },
      linkedin: {
        professional: { subject: `${roleTitle}机会`, body: `${firstName}您好，您的背景很适合我们TP马来西亚的${roleTitle}职位。有空聊聊吗？` },
        friendly: { subject: `嗨！🎯`, body: `Hey ${firstName}！您的简历很棒！TP马来西亚有个${roleTitle}的机会，感兴趣吗？😊` },
        urgent: { subject: `紧急招聘`, body: `${firstName}，TP马来西亚紧急需要${roleTitle}。本周可以聊聊吗？` }
      },
      sms: {
        professional: { body: `[TP Malaysia] ${firstName}，${roleTitle}职位招聘中。回复"是"了解详情。` },
        friendly: { body: `嗨${firstName}！🎉 TP招聘${roleTitle}！回复"是"！🚀` },
        urgent: { body: `⚡ 紧急：${firstName}，TP招聘${roleTitle}。立即回复！` }
      }
    }
  };

  // Get template for requested language, fallback to EN
  const langTemplates = templates[language] || templates["EN"];
  const channelTemplates = langTemplates[channel] || langTemplates["email"];
  const message = channelTemplates[tone] || channelTemplates["professional"];

  // Also generate all tones for this channel+language combo
  const allTones = Object.entries(channelTemplates).map(([t, msg]) => ({
    tone: t,
    ...msg,
  }));

  return { selected: message, allTones, language, channel };
}
