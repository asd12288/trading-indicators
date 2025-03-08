"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { FiUser, FiMail, FiBriefcase, FiMessageSquare, FiSend, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactForm } from "@/lib/actions/contactActions";

// Validation schema for the form
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  title: z.string().min(1, { message: "Please select a title" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormData = z.infer<typeof formSchema>;

const ContactForm = () => {
  const t = useTranslations("ContactPage.form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<{
    submitted: boolean;
    success: boolean;
    message: string | null;
  }>({
    submitted: false,
    success: false,
    message: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      title: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const result = await submitContactForm(data);
      
      setFormState({
        submitted: true,
        success: result.success,
        message: result.message || (result.success ? t("feedback.success") : t("feedback.error")),
      });
      
      if (result.success) {
        reset();
        // Reset form state after success message
        setTimeout(() => {
          setFormState(prev => ({ ...prev, submitted: false }));
        }, 5000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormState({
        submitted: true,
        success: false,
        message: t("feedback.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold text-white mb-6">{t("title")}</h2>
        
        {/* Name field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <FiUser className="text-emerald-500" /> {t("nameLabel")}
          </label>
          <input
            {...register("name")}
            placeholder={t("namePlaceholder")}
            className={`w-full rounded-lg border bg-slate-700/50 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              errors.name ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <FiMail className="text-emerald-500" /> {t("emailLabel")}
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            className={`w-full rounded-lg border bg-slate-700/50 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              errors.email ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Title/Role field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <FiBriefcase className="text-emerald-500" /> {t("titleLabel")}
          </label>
          <select
            {...register("title")}
            className={`w-full rounded-lg border bg-slate-700/50 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              errors.title ? "border-red-500" : "border-slate-600"
            }`}
          >
            <option value="">{t("titleSelect")}</option>
            <option value="Trader">{t("titleTrader")}</option>
            <option value="Investor">{t("titleInvestor")}</option>
            <option value="Broker">{t("titleBroker")}</option>
            <option value="Other">{t("titleOther")}</option>
          </select>
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Message field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <FiMessageSquare className="text-emerald-500" /> {t("messageLabel")}
          </label>
          <textarea
            {...register("message")}
            rows={5}
            placeholder={t("messagePlaceholder")}
            className={`w-full rounded-lg border bg-slate-700/50 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              errors.message ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
          )}
        </div>

        {/* Submit button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-emerald-500 hover:to-teal-600 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t("buttonSubmitting")}</span>
              </>
            ) : (
              <>
                <FiSend className="h-5 w-5" />
                <span>{t("buttonSubmit")}</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Success/Error message */}
        <AnimatePresence>
          {formState.submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-md p-4 flex items-center ${
                formState.success ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"
              }`}
            >
              {formState.success ? (
                <FiCheckCircle className="mr-2 h-5 w-5 flex-shrink-0" />
              ) : (
                <svg className="mr-2 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{formState.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default ContactForm;
