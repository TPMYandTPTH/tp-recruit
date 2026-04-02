"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, CheckCircle2, Copy, ExternalLink } from "lucide-react";

interface Role {
  id: string;
  title: string;
  client: string;
  salaryMin: number;
  salaryMid: number;
  salaryMax: number;
  currency: string;
  interviewMode: string;
}

export default function CreateCandidateForm() {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    portalUrl: string;
    candidateName: string;
  } | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleId: "",
    source: "PORTAL",
  });

  useEffect(() => {
    fetch("/api/roles")
      .then((r) => r.json())
      .then((data) => setRoles(data.roles || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setResult({
        portalUrl: data.portalUrl,
        candidateName: `${form.firstName} ${form.lastName}`,
      });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roleId: "",
        source: "PORTAL",
      });
    }
  };

  const copyLink = () => {
    if (result) {
      navigator.clipboard.writeText(result.portalUrl);
    }
  };

  const selectedRole = roles.find((r) => r.id === form.roleId);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#4B4C6A] text-white rounded-lg text-sm font-medium hover:bg-[#3e2666] transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Candidate
      </button>
    );
  }

  // Success state — show portal link
  if (result) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {result.candidateName} created!
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Share this portal link with the candidate:
            </p>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <code className="text-sm text-[#4B4C6A] flex-1 truncate">
                {result.portalUrl}
              </code>
              <button
                onClick={copyLink}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Copy link"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
              <a
                href={result.portalUrl}
                target="_blank"
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Open portal"
              >
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </a>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setResult(null);
                  setOpen(true);
                }}
                className="px-4 py-2 bg-[#4B4C6A] text-white rounded-lg text-sm font-medium hover:bg-[#3e2666]"
              >
                Create Another
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setOpen(false);
                  window.location.reload();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          New Candidate
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              required
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-[#4B4C6A] focus:outline-none text-sm"
              placeholder="Sarah"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-[#4B4C6A] focus:outline-none text-sm"
              placeholder="Ahmad"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-[#4B4C6A] focus:outline-none text-sm"
              placeholder="sarah@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-[#4B4C6A] focus:outline-none text-sm"
              placeholder="+60123456789"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <select
            required
            value={form.roleId}
            onChange={(e) => setForm({ ...form, roleId: e.target.value })}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
          >
            <option value="">Select a role...</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title} — {role.client}
              </option>
            ))}
          </select>
          {selectedRole && (
            <p className="text-xs text-gray-500 mt-1">
              Salary band: {selectedRole.salaryMin.toLocaleString()} —{" "}
              {selectedRole.salaryMid.toLocaleString()} —{" "}
              {selectedRole.salaryMax.toLocaleString()} {selectedRole.currency}{" "}
              | Interview: {selectedRole.interviewMode.replace(/_/g, " ")}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <select
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
          >
            <option value="PORTAL">Portal</option>
            <option value="JOB_BOARD">Job Board</option>
            <option value="REFERRAL">Referral</option>
            <option value="WALK_IN">Walk-in</option>
            <option value="SOCIAL_MEDIA">Social Media</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !form.firstName || !form.lastName || !form.email || !form.roleId}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4B4C6A] text-white rounded-lg font-medium hover:bg-[#3e2666] disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create Candidate & Generate Portal Link
            </>
          )}
        </button>
      </form>
    </div>
  );
}
