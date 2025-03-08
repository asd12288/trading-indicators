"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const AffiliateSignupForm = () => {
  const t = useTranslations("AffiliatePage");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    experience: "",
    message: "",
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.terms) {
      setError(t("signupForm.errors.terms"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Prepare email data - format it to work with the existing email API
    const emailData = {
      name: formData.name,
      email: formData.email,
      title: `Affiliate Application - ${formData.experience} level`,
      message: `
Website/Social: ${formData.website || "Not provided"}
Experience Level: ${formData.experience}

Message:
${formData.message || "No additional information provided."}
      `.trim(),
    };

    // Submit to the same API used by ContactForm
    try {
      const response = await fetch("/api/email/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit affiliate application");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        website: "",
        experience: "",
        message: "",
        terms: false,
      });
    } catch (err) {
      setError(t("signupForm.errors.general"));
      console.error("Error submitting affiliate form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="signup" className="bg-slate-950 py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl rounded-xl border border-slate-700/50 bg-slate-900/80 p-8 backdrop-blur-sm md:p-12"
        >
          {!submitted ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-white">
                  {t("signupForm.title")}
                </h2>
                <p className="text-lg text-slate-300">
                  {t("signupForm.subtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      {t("signupForm.nameLabel")}*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t("signupForm.namePlaceholder")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      {t("signupForm.emailLabel")}*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t("signupForm.emailPlaceholder")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="website"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      {t("signupForm.websiteLabel")}
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t("signupForm.websitePlaceholder")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      {t("signupForm.experienceLabel")}*
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        {t("signupForm.experienceSelect")}
                      </option>
                      <option value="none">
                        {t("signupForm.experienceNone")}
                      </option>
                      <option value="beginner">
                        {t("signupForm.experienceBeginner")}
                      </option>
                      <option value="intermediate">
                        {t("signupForm.experienceIntermediate")}
                      </option>
                      <option value="advanced">
                        {t("signupForm.experienceAdvanced")}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    {t("signupForm.messageLabel")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("signupForm.messagePlaceholder")}
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-800 focus:ring-blue-500"
                    />
                  </div>
                  <label
                    htmlFor="terms"
                    className="ml-2 text-sm text-slate-300"
                  >
                    {t("signupForm.termsLabel")}*
                    <a href="#" className="ml-1 text-blue-400 hover:underline">
                      {t("signupForm.termsLink")}
                    </a>
                  </label>
                </div>

                {error && (
                  <div className="rounded border border-red-700/50 bg-red-900/30 px-4 py-3 text-red-400">
                    {error}
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70"
                  >
                    {isSubmitting
                      ? t("signupForm.submitting")
                      : t("signupForm.submitButton")}
                  </button>
                  <p className="mt-2 text-xs text-slate-400">
                    {t("signupForm.requiredFields")}
                  </p>
                </div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-white">
                {t("signupForm.successTitle")}
              </h2>
              <p className="mb-6 text-lg text-slate-300">
                {t("signupForm.successMessage")}
              </p>
              <p className="text-slate-400">{t("signupForm.successContact")}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AffiliateSignupForm;
