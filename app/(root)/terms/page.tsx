import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen px-6 py-12 text-slate-200 md:px-16">
      <div className="mx-auto max-w-4xl rounded-xl bg-slate-800 p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-slate-100">
          Terms and Conditions
        </h1>
        <p className="mb-4 text-slate-300">
          Welcome to World Trade Signals. By using our website, you agree to
          comply with the following terms and conditions. Please read them
          carefully.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          1. Acceptance of Terms
        </h2>
        <p className="mt-2 text-slate-300">
          By accessing and using our services, you accept and agree to be bound
          by these Terms and Conditions. If you do not agree, please do not use
          our services.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          2. Use of Services
        </h2>
        <p className="mt-2 text-slate-300">
          Our services are intended for informational purposes only. We do not
          guarantee any financial gains, and users should exercise caution when
          making trade decisions.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          3. Intellectual Property
        </h2>
        <p className="mt-2 text-slate-300">
          All content provided on this website, including text, graphics, logos,
          and software, is the property of World Trade Signals and is protected
          by copyright laws.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          4. Disclaimer
        </h2>
        <p className="mt-2 text-slate-300">
          We do not provide investment advice. Our signals and insights are for
          educational purposes only. You assume full responsibility for any
          decisions you make.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          5. Limitation of Liability
        </h2>
        <p className="mt-2 text-slate-300">
          World Trade Signals is not responsible for any financial losses
          resulting from the use of our services. Users should conduct their own
          research before making any trade decisions.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          6. Amendments
        </h2>
        <p className="mt-2 text-slate-300">
          We reserve the right to modify these terms at any time. Users will be
          notified of significant changes.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          7. Contact Information
        </h2>
        <p className="mt-2 text-slate-300">
          If you have any questions about these Terms and Conditions, please
          contact us at support@worldtradesignals.com.
        </p>
      </div>
      
      {/* Refund Policy */}
      <div className="mx-auto mt-12 max-w-4xl rounded-xl bg-slate-800 p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-slate-100">Refund Policy</h1>
        
        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          1. No Refunds Policy
        </h2>
        <p className="mt-2 text-slate-300">
          All purchases made on World Trade Signals are final. Due to the nature
          of digital products and services, we do not offer refunds or exchanges.
        </p>
        
        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          2. Exceptions
        </h2>
        <p className="mt-2 text-slate-300">
          Refunds may be issued in rare cases where there has been a billing
          error, or if the service has not been delivered as described. Any
          requests for exceptions must be submitted within 7 days of purchase.
        </p>
        
        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          3. How to Request a Refund
        </h2>
        <p className="mt-2 text-slate-300">
          To request a refund (if applicable), please contact us at
          support@worldtradesignals.com with your transaction details and
          reason for the request.
        </p>
        
        <h2 className="mt-6 text-2xl font-semibold text-slate-100">
          4. Processing Time
        </h2>
        <p className="mt-2 text-slate-300">
          If a refund is approved, it will be processed within 5-10 business
          days. Refunds will be credited back to the original payment method.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
