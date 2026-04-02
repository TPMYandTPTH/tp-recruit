"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, MapPin, Phone, Mail, User, Globe } from "lucide-react";

export default function WalkInPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [portalUrl, setPortalUrl] = useState("");
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    nationality: "", city: "", roleId: "",
    languageProficiency: "English",
    source: "WALK_IN",
  });

  useEffect(() => {
    fetch("/api/roles").then(r => r.json()).then(d => setRoles(d.roles || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      roleId: form.roleId || "auto",
      source: "WALK_IN",
      notes: JSON.stringify({
        nationality: form.nationality,
        city: form.city,
        languageProficiency: form.languageProficiency,
        registeredVia: "QR_WALK_IN",
      }),
    };

    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      setPortalUrl(data.portalUrl);
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome aboard! 🎉</h1>
          <p className="text-gray-600 mb-6">
            Thank you, <span className="font-semibold">{form.firstName}</span>! Your registration is complete.
            You will receive an email with your portal login details shortly.
          </p>
          <div className="bg-[#eeedf2] rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Your Candidate Portal</p>
            <a href={portalUrl} className="text-sm text-[#4B4C6A] font-medium hover:underline break-all">{portalUrl}</a>
          </div>
          <p className="text-xs text-gray-400">A recruiter will contact you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      {/* Header */}
      <div className="tp-gradient text-white px-4 py-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3 text-lg font-bold">TP</div>
        <h1 className="text-xl font-bold">Walk-in Registration</h1>
        <p className="text-sm text-white/70 mt-1">Teleperformance Malaysia — Quick Apply</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 -mt-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-[#e6e6e5] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <User className="w-3 h-3 inline mr-1" />First Name *
              </label>
              <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20 focus:border-[#4B4C6A]"
                placeholder="First name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Last Name *</label>
              <input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20 focus:border-[#4B4C6A]"
                placeholder="Last name" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <Mail className="w-3 h-3 inline mr-1" />Email *
            </label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20 focus:border-[#4B4C6A]"
              placeholder="your.email@example.com" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <Phone className="w-3 h-3 inline mr-1" />Phone *
            </label>
            <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20 focus:border-[#4B4C6A]"
              placeholder="+60 12-345 6789" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <MapPin className="w-3 h-3 inline mr-1" />City
              </label>
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20 focus:border-[#4B4C6A]"
                placeholder="Kuala Lumpur" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nationality</label>
              <input value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20 focus:border-[#4B4C6A]"
                placeholder="Malaysian" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <Globe className="w-3 h-3 inline mr-1" />Language Proficiency
            </label>
            <select value={form.languageProficiency} onChange={e => setForm({...form, languageProficiency: e.target.value})}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5">
              <option>English</option>
              <option>Bahasa Malaysia</option>
              <option>Mandarin</option>
              <option>Cantonese</option>
              <option>Japanese</option>
              <option>Korean</option>
              <option>Thai</option>
              <option>Arabic</option>
              <option>Hindi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Position Interested In</label>
            <select value={form.roleId} onChange={e => setForm({...form, roleId: e.target.value})}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5">
              <option value="">Any available position</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.title} — {r.client}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#4B4C6A] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#3a3b54] transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</> : "Register Now →"}
          </button>

          <p className="text-[10px] text-gray-400 text-center">
            By registering, you consent to Teleperformance processing your data for recruitment purposes.
          </p>
        </form>
      </div>
    </div>
  );
}
