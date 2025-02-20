import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen  text-slate-200 py-12 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-semibold text-slate-100 mb-6">Privacy Policy</h1>
        <p className="text-sm text-slate-300">
          <strong>Effective Date:</strong> 2025-01-01
        </p>
        
        <h2 className="text-2xl font-semibold text-slate-100 mt-6 underline">1. Information We Collect</h2>
        <p className="text-slate-300 mt-2">
          We collect information that you provide directly to us, such as when you sign up, contact support, or use our services. This may include personal details like your name, email address, and transaction history.
        </p>
        
        <h2 className="text-2xl font-semibold text-slate-100 mt-6 underline">2. How We Use Your Information</h2>
        <p className="text-slate-300 mt-2">
          We use your information to provide, improve, and personalize our services. This includes processing transactions, sending notifications, and enhancing user experience.
        </p>
        
        <h2 className="text-2xl font-semibold text-slate-100 mt-6 underline">3. Data Sharing & Security</h2>
        <p className="text-slate-300 mt-2">
          We do not sell your personal information. We may share data with trusted partners for operational purposes, but we ensure appropriate security measures are in place to protect your privacy.
        </p>
        
        <h2 className="text-2xl font-semibold text-slate-100 mt-6 underline">4. Your Rights & Choices</h2>
        <p className="text-slate-300 mt-2">
          You have the right to access, modify, or request deletion of your personal data. You may also opt-out of certain data processing activities by contacting us.
        </p>
        
        <h2 className="text-2xl font-semibold text-slate-100 mt-6 underline">5. Changes to This Policy</h2>
        <p className="text-slate-300 mt-2">
          We reserve the right to update this privacy policy at any time. We will notify users of significant changes through our platform.
        </p>
        
        <h2 className="text-2xl font-semibold text-slate-100 mt-6 underline">6. Contact Information</h2>
        <p className="text-slate-300 mt-2">
          If you have any questions about this privacy policy, contact us at <a href="mailto:privacy@worldtradesignals.com" className="text-blue-400 underline">support@trader-map.com</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
