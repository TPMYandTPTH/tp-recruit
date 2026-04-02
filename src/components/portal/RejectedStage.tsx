"use client";

interface Props {
  stage: string;
}

export default function RejectedStage({ stage }: Props) {
  const messages: Record<string, { title: string; body: string }> = {
    SCREENING_FAILED: {
      title: "Thank You for Your Interest",
      body: "Unfortunately, you do not meet the eligibility requirements for this role at this time. We encourage you to check back for future opportunities that may be a better fit.",
    },
    ASSESSMENT_FAILED: {
      title: "Thank You for Completing the Assessment",
      body: "After reviewing your assessment results, we're unable to move forward with your application at this time. We appreciate the effort you put in and encourage you to apply again in the future.",
    },
    INTERVIEW_FAILED: {
      title: "Thank You for the Interview",
      body: "After careful consideration, we've decided to move forward with other candidates for this position. We value the time you spent with us and encourage you to explore other opportunities with us.",
    },
    REJECTED: {
      title: "Application Update",
      body: "Thank you for your interest. Unfortunately, we're unable to proceed with your application at this time.",
    },
    WITHDRAWN: {
      title: "Application Withdrawn",
      body: "Your application has been withdrawn. If you'd like to reapply in the future, you're welcome to do so.",
    },
    CLOSED: {
      title: "Application Closed",
      body: "Your application process has been closed. Thank you for your interest, and we wish you the best in your career.",
    },
  };

  const msg = messages[stage] || messages.REJECTED;

  return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">💙</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{msg.title}</h2>
      <p className="text-gray-500 max-w-md mx-auto">{msg.body}</p>
    </div>
  );
}
