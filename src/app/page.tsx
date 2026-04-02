"use client";

import { useState } from "react";
import {
  FileText,
  MapPin,
  Mail,
  Phone,
  User,
  Calendar,
  Globe,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  city: string;
  dateOfBirth: string;
  languageProficiency: string;
  workPreference: string;
  earliestStartDate: string;
  cvFile: File | null;
}

interface ModalState {
  ageVerification: boolean;
  dataPrivacy: boolean;
}

export default function LandingPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    city: "",
    dateOfBirth: "",
    languageProficiency: "",
    workPreference: "",
    earliestStartDate: "",
    cvFile: null,
  });

  const [modals, setModals] = useState<ModalState>({
    ageVerification: true,
    dataPrivacy: false,
  });

  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<{
    portalUrl: string;
    portalToken: string;
  } | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const languages = ["Mandarin", "Cantonese", "Japanese", "Korean", "Malay", "English"];
  const workPreferences = ["Work from Home", "On-Site", "Hybrid"];

  const handleAgeVerification = (confirmed: boolean) => {
    if (confirmed) {
      setModals({ ageVerification: false, dataPrivacy: true });
    } else {
      alert("You must be 18 or older to apply. If you have questions, please contact us.");
    }
  };

  const handlePrivacyAccept = () => {
    setPrivacyAccepted(true);
    setModals({ ...modals, dataPrivacy: false });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, cvFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!privacyAccepted) {
      setErrorMessage("Please accept the data privacy terms to continue");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    setFormState("loading");
    setErrorMessage("");

    try {
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ") || "Applicant";

      const additionalData = {
        nationality: formData.nationality,
        city: formData.city,
        dateOfBirth: formData.dateOfBirth,
        languageProficiency: formData.languageProficiency,
        workPreference: formData.workPreference,
        earliestStartDate: formData.earliestStartDate,
      };

      const payload = {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        roleId: "auto",
        source: "LANDING_PAGE",
        notes: JSON.stringify(additionalData),
      };

      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to submit application (${response.status})`
        );
      }

      const data = await response.json();
      setFormState("success");
      setSuccessData({
        portalUrl: data.portalUrl,
        portalToken: data.portalToken,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        nationality: "",
        city: "",
        dateOfBirth: "",
        languageProficiency: "",
        workPreference: "",
        earliestStartDate: "",
        cvFile: null,
      });
    } catch (error) {
      setFormState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred while submitting your application"
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Age Verification Modal */}
      {modals.ageVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Age Verification</h2>
            <p className="text-gray-600 mb-6">
              To apply for positions at Teleperformance Malaysia, you must be at least 18 years old.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleAgeVerification(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                No, I'm under 18
              </button>
              <button
                onClick={() => handleAgeVerification(true)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#4B4C6A] to-[#3e2666] text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Yes, I'm 18 or older
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Privacy Modal */}
      {modals.dataPrivacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Privacy Consent</h2>
            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <p>
                By submitting this application, you consent to Teleperformance Malaysia collecting, processing, and storing your personal information in accordance with our Privacy Policy.
              </p>
              <p>
                Your data will be used solely for recruitment purposes and will be handled in compliance with Malaysian data protection regulations.
              </p>
              <p>
                We will not share your information with third parties without your explicit consent, except as required by law.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setModals({ ...modals, dataPrivacy: false })}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handlePrivacyAccept}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#4B4C6A] to-[#3e2666] text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-[#3e2666] to-[#4B4C6A] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/tp-logo-white.png" alt="TP" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold">TP CAREERS</h1>
              <div className="flex items-center gap-1 text-sm text-gray-200">
                <MapPin size={14} />
                Malaysia
              </div>
            </div>
          </div>
          <button className="px-6 py-2 bg-[#FF0082] text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors">
            NOW HIRING
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3e2666] to-[#4B4C6A] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            We'd love to have you on the team
          </h2>
          <p className="text-xl text-gray-100 mb-8">
            Join Teleperformance Malaysia and work in a dynamic multilingual environment.
            We're hiring for customer service, technical support, and sales roles.
          </p>

          {/* Language Tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {languages.map((lang) => (
              <span
                key={lang}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-full text-sm font-medium border border-white border-opacity-30 hover:bg-opacity-30 transition-all"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {formState === "success" && successData ? (
            // Success State
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for applying to Teleperformance Malaysia. Your application has been received.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Your candidate portal:</p>
                  <p className="text-[#4B4C6A] font-mono text-sm break-all mb-4">{successData.portalUrl}</p>
                  <button
                    onClick={() => {
                      window.location.href = successData.portalUrl;
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#4B4C6A] to-[#3e2666] text-white font-medium rounded-lg hover:shadow-lg transition-all"
                  >
                    Go to Your Portal
                  </button>
                </div>
                <p className="text-gray-600 text-sm">
                  We'll review your application and get back to you shortly with next steps.
                </p>
              </div>
            </div>
          ) : (
            // Form State
            <div className="bg-white rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "#ece9e7" }}>
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User size={20} />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g., John Tan"
                        className="w-full px-4 py-3 border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]"
                        style={{ backgroundColor: "#f5f4f2" }}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]"
                        style={{ backgroundColor: "#f5f4f2" }}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+60 12 345 6789"
                        className="w-full px-4 py-3 border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]"
                        style={{ backgroundColor: "#f5f4f2" }}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Nationality
                        </label>
                        <input
                          type="text"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleInputChange}
                          placeholder="e.g., Malaysian"
                          className="w-full px-4 py-3 border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]"
                          style={{ backgroundColor: "#f5f4f2" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g., Kuala Lumpur"
                          className="w-full px-4 py-3 border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]"
                          style={{ backgroundColor: "#f5f4f2" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]"
                        style={{ backgroundColor: "#f5f4f2" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Language Proficiency Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Globe size={20} />
                    Language Proficiency
                  </h3>
                  <select
                    name="languageProficiency"
                    value={formData.languageProficiency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]"
                    style={{ backgroundColor: "#f5f4f2" }}
                  >
                    <option value="">Select your primary language</option>
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock size={20} />
                    Availability (Optional)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Work Preference
                      </label>
                      <select
                        name="workPreference"
                        value={formData.workPreference}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]"
                        style={{ backgroundColor: "#f5f4f2" }}
                      >
                        <option value="">Select work preference</option>
                        {workPreferences.map((pref) => (
                          <option key={pref} value={pref}>
                            {pref}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Earliest Start Date
                      </label>
                      <input
                        type="date"
                        name="earliestStartDate"
                        value={formData.earliestStartDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]"
                        style={{ backgroundColor: "#f5f4f2" }}
                      />
                    </div>
                  </div>
                </div>

                {/* CV Upload Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText size={20} />
                    CV Upload (Optional)
                  </h3>
                  <div className="border-2 border-dashed border-[#c2c7cd] rounded-lg p-6 text-center hover:bg-white transition-colors">
                    <input
                      type="file"
                      name="cvFile"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="cv-input"
                    />
                    <label
                      htmlFor="cv-input"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <FileText size={32} className="text-[#4B4C6A]" />
                      <span className="font-semibold text-gray-900">
                        {formData.cvFile ? formData.cvFile.name : "Choose file or drag and drop"}
                      </span>
                      <span className="text-sm text-[#8a8da1]">PDF, DOC, or DOCX (max 5 MB)</span>
                    </label>
                  </div>
                </div>

                {/* Data Privacy Checkbox */}
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#c2c7cd]">
                  <input
                    type="checkbox"
                    id="privacy-check"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#4B4C6A] cursor-pointer"
                  />
                  <label htmlFor="privacy-check" className="text-sm text-gray-700 cursor-pointer">
                    I accept the data privacy terms and consent to Teleperformance Malaysia processing my information
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formState === "loading" || !privacyAccepted}
                  className={`w-full px-6 py-4 font-semibold rounded-lg transition-all text-white ${
                    formState === "loading" || !privacyAccepted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#4B4C6A] to-[#3e2666] hover:shadow-lg"
                  }`}
                >
                  {formState === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">About Teleperformance</h4>
              <p className="text-sm">
                A leading global digital customer experience and business services company serving Fortune 500
                companies.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  careers@teleperformance.com.my
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  +60 3 7725 9888
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Teleperformance Malaysia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
