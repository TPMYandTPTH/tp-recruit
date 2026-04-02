"use client";

import { useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  FileText,
  Zap,
  ChevronDown,
  ChevronUp,
  Eye,
  Send,
  ToggleLeft,
  Calendar,
  Download,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

export default function HROnboardingPage() {
  const [expandedHire, setExpandedHire] = useState<string | null>("chin-wei-jun");
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Generate PDF offer letter for a candidate
  const generateDocument = async (templateName: string, candidateName?: string) => {
    const hire = newHires[0]; // Default to first hire
    const type = templateName.toLowerCase().includes("nda") ? "nda" : "offer-letter";

    showToast(`Generating ${templateName}...`);

    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: candidateName || hire.name,
          role: hire.role,
          client: "Tech Giant",
          salary: "3,100",
          currency: "MYR",
          startDate: hire.startDate + ", 2026",
          manager: "Sarah Abdullah",
          type,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const html = await res.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      showToast(`${templateName} generated successfully!`);
    } catch {
      showToast(`Error generating ${templateName}`);
    }
  };

  // Export onboarding data to CSV
  const exportOnboardingCSV = () => {
    const headers = ["Name", "Role", "Start Date", "Progress %", "Completed Items", "Pending Items"];
    const rows = newHires.map(h => [
      h.name, h.role, h.startDate, h.progress,
      h.checklist.filter(c => c.status === "completed").length,
      h.checklist.filter(c => c.status === "pending").length
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TP_Onboarding_Export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Onboarding data exported to CSV");
  };

  const stats = [
    { label: "Starting This Week", value: 3, icon: Calendar, color: "bg-[#eeedf2] text-[#4B4C6A]" },
    { label: "In Progress", value: 8, icon: Clock, color: "bg-amber-100 text-amber-600" },
    { label: "Documents Pending", value: 12, icon: FileText, color: "bg-blue-100 text-blue-600" },
    { label: "Training Scheduled", value: 5, icon: Zap, color: "bg-green-100 text-green-600" },
    { label: "Completed This Month", value: 15, icon: CheckCircle2, color: "bg-purple-100 text-purple-600" },
  ];

  const newHires = [
    {
      id: "chin-wei-jun",
      name: "Chin Wei Jun",
      role: "CSR Mandarin",
      startDate: "April 1",
      progress: 75,
      checklist: [
        { item: "Offer letter signed", status: "completed" },
        { item: "Background check cleared", status: "completed" },
        { item: "Bank details submitted", status: "completed" },
        { item: "IT equipment request", status: "in-progress" },
        { item: "Training schedule confirmed", status: "pending" },
        { item: "Buddy assigned", status: "pending" },
        { item: "Day 1 welcome pack sent", status: "pending" },
      ],
    },
    {
      id: "tan-mei-xuan",
      name: "Tan Mei Xuan",
      role: "CSR Cantonese",
      startDate: "April 7",
      progress: 40,
      checklist: [
        { item: "Offer letter signed", status: "completed" },
        { item: "Background check cleared", status: "completed" },
        { item: "Bank details submitted", status: "pending" },
        { item: "IT equipment request", status: "pending" },
        { item: "Training schedule confirmed", status: "pending" },
        { item: "Buddy assigned", status: "pending" },
        { item: "Day 1 welcome pack sent", status: "pending" },
      ],
    },
    {
      id: "priya-devi",
      name: "Priya Devi",
      role: "Tech Support EN",
      startDate: "April 14",
      progress: 15,
      checklist: [
        { item: "Offer letter signed", status: "completed" },
        { item: "Background check", status: "pending" },
        { item: "Bank details submitted", status: "pending" },
        { item: "IT equipment request", status: "pending" },
        { item: "Training schedule confirmed", status: "pending" },
        { item: "Buddy assigned", status: "pending" },
        { item: "Day 1 welcome pack sent", status: "pending" },
      ],
    },
  ];

  const templates = [
    { name: "Offer Letter Template", type: "Word", lastUsed: "Mar 20" },
    { name: "NDA Template", type: "PDF", lastUsed: "Mar 18" },
    { name: "Employee Handbook", type: "PDF", version: "v2026.1" },
    { name: "Benefits Enrollment Form", type: "Word" },
    { name: "Emergency Contact Form", type: "Word" },
    { name: "IT Access Request Form", type: "Word" },
  ];

  const workflows = [
    { day: "Day -7", name: "Send welcome email", active: true },
    { day: "Day -3", name: "IT equipment provisioning", active: true },
    { day: "Day -1", name: "Send Day 1 agenda", active: true },
    { day: "Day 0", name: "Orientation session invite", active: true },
    { day: "Day 1", name: "Buddy introduction email", active: true },
    { day: "Day 7", name: "Week 1 check-in survey", active: true },
    { day: "Day 30", name: "Probation review reminder", active: false },
  ];

  const trainingCalendar = [
    { day: "Mon", title: "TP Culture & Values", time: "9am-12pm", attendees: 5 },
    { day: "Tue", title: "System Training - CRM Basics", time: "2pm-5pm", attendees: 3 },
    { day: "Wed", title: "Language Assessment - Mandarin", time: "10am", attendees: 2 },
    { day: "Thu", title: "Customer Service Excellence Workshop", time: "9am-4pm", attendees: 8 },
    { day: "Fri", title: "Compliance & Data Privacy", time: "2pm-3pm", attendees: 5 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />

      {/* Header */}
      <header className="bg-gradient-to-r from-[#4B4C6A] to-[#5A5B7B] text-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Onboarding Center</h1>
            <InfoTooltip text="Manage new hire onboarding from offer acceptance to Day 1" />
          </div>
          <p className="text-white/80 mt-2">Manage new hire onboarding from offer acceptance to Day 1</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={exportOnboardingCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Download size={13} />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-[#E6E6E5] p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#4B4C6A]">{stat.value}</p>
                    <p className="text-xs text-[#676767]">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left: New Hires Pipeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-[#E6E6E5] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E6E6E5] bg-[#ECE9E7]">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#4B4C6A]" />
                  <h2 className="text-lg font-semibold text-[#414141]">New Hires Pipeline</h2>
                  <InfoTooltip text="Track onboarding progress for each new hire with detailed checklists" />
                </div>
              </div>

              <div className="divide-y divide-[#E6E6E5]">
                {newHires.map((hire) => (
                  <div key={hire.id} className="p-6">
                    <button
                      onClick={() =>
                        setExpandedHire(expandedHire === hire.id ? null : hire.id)
                      }
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#414141]">{hire.name}</h3>
                          <p className="text-sm text-[#676767]">{hire.role} • Start: {hire.startDate}</p>
                        </div>
                        {expandedHire === hire.id ? (
                          <ChevronUp className="w-5 h-5 text-[#4B4C6A]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#4B4C6A]" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#676767]">Progress</span>
                          <span className="font-medium text-[#4B4C6A]">{hire.progress}%</span>
                        </div>
                        <div className="w-full bg-[#ECE9E7] rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#4B4C6A] to-[#5A5B7B] h-2 rounded-full transition-all"
                            style={{ width: `${hire.progress}%` }}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Expanded checklist */}
                    {expandedHire === hire.id && (
                      <div className="mt-4 pt-4 border-t border-[#E6E6E5] space-y-3">
                        {hire.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {getStatusIcon(item.status)}
                            <span
                              className={`text-sm ${
                                item.status === "completed"
                                  ? "text-green-600 line-through"
                                  : item.status === "in-progress"
                                    ? "text-amber-600 font-medium"
                                    : "text-[#676767]"
                              }`}
                            >
                              {item.item}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Templates & Automations */}
          <div className="space-y-6">
            {/* Document Templates */}
            <div className="bg-white rounded-xl border border-[#E6E6E5] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E6E6E5] bg-[#ECE9E7]">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#4B4C6A]" />
                  <h2 className="text-lg font-semibold text-[#414141]">Templates</h2>
                </div>
              </div>

              <div className="divide-y divide-[#E6E6E5]">
                {templates.map((template, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#f8f7f5] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#414141] truncate">{template.name}</p>
                      <p className="text-xs text-[#848DAD]">
                        {template.lastUsed ? `Last used: ${template.lastUsed}` : template.version}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => {
                          if (template.name.includes("Offer Letter") || template.name.includes("NDA")) {
                            generateDocument(template.name);
                          } else {
                            showToast(`Previewing: ${template.name}`);
                          }
                        }}
                        className="p-1.5 hover:bg-[#ECE9E7] rounded text-[#4B4C6A]"
                        title={template.name.includes("Offer") || template.name.includes("NDA") ? "Generate & Preview PDF" : "Preview"}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (template.name.includes("Offer Letter") || template.name.includes("NDA")) {
                            generateDocument(template.name);
                            showToast(`${template.name} generated and sent to new hires`);
                          } else {
                            showToast(`${template.name} sent to new hires`);
                          }
                        }}
                        className="p-1.5 hover:bg-[#ECE9E7] rounded text-[#FF0082]"
                        title="Send"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Automated Workflows */}
            <div className="bg-white rounded-xl border border-[#E6E6E5] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E6E6E5] bg-[#ECE9E7]">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#4B4C6A]" />
                  <h2 className="text-lg font-semibold text-[#414141]">Workflows</h2>
                  <InfoTooltip text="Automated triggers that send documents and communications at key onboarding milestones" />
                </div>
              </div>

              <div className="divide-y divide-[#E6E6E5]">
                {workflows.map((workflow, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#f8f7f5] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#4B4C6A] uppercase">{workflow.day}</p>
                      <p className="text-sm text-[#414141]">{workflow.name}</p>
                    </div>
                    <ToggleLeft
                      className={`w-5 h-5 ${
                        workflow.active ? "text-green-600" : "text-[#C2C7CD]"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Training Calendar */}
        <div className="bg-white rounded-xl border border-[#E6E6E5] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E6E6E5] bg-[#ECE9E7]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#4B4C6A]" />
              <h2 className="text-lg font-semibold text-[#414141]">Training Calendar</h2>
              <InfoTooltip text="Scheduled training sessions for new hires across the week" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
            {trainingCalendar.map((session, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#ECE9E7] border border-[#E6E6E5]">
                <p className="text-sm font-bold text-[#4B4C6A] mb-2">{session.day}</p>
                <p className="text-sm font-medium text-[#414141] mb-1">{session.title}</p>
                <p className="text-xs text-[#676767] mb-2">{session.time}</p>
                <div className="flex items-center gap-1 text-xs text-[#848DAD]">
                  <Users className="w-3 h-3" />
                  {session.attendees} attendees
                </div>
              </div>
            ))}
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg bg-[#4B4C6A] text-white text-sm font-medium">
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
