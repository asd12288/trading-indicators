import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold">Terms of Service</h1>
        <p className="text-sm">
          <strong>Effective Date:</strong> 2025-01-01
        </p>
        <h2 className="text-2xl font-medium underline">
          1. Use of Our Services
        </h2>
        <ul className="space-y-6">
          <li className="text-sm">
            You must be at least 18 years old or have parental consent to use
            our services.
          </li>
          <li className="text-sm">
            You agree not to misuse our services or engage in any illegal
            activity.
          </li>
          <li className="text-sm">
            We reserve the right to suspend or terminate your access if you
            violate these terms.
          </li>
        </ul>
        <h2 className="text-2xl font-medium underline">
          2. Intellectual Property
        </h2>
        <p>
          All content, logos, and materials on this website are owned by
          worldtradesignals and may not be used without permission.
        </p>
        <h2 className="text-2xl font-medium underline">
          3. Limitation of Liability
        </h2>
        <p>
          We are not liable for any direct, indirect, incidental, or
          consequential damages arising from your use of our website.
        </p>
        <h2 className="text-2xl font-medium underline">4. Changes to Terms</h2>
        <p>
          We reserve the right to update these terms at any time. Continued use
          of our services after changes means you accept the new terms.
        </p>
        <p>For any questions, contact us at contact@worldtradesignals.com</p>
      </div>
    </div>
  );
};

export default page;
