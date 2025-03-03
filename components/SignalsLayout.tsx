import { Link } from "@/i18n/routing";
import React from "react";
import AlertNotification from "./AlertNotification";
import SignalsList from "./SignalCard/SignalsList";
import { useTranslations } from "next-intl";

const SignalsLayout = ({ userId }) => {
  const t = useTranslations("Signals");
  return (
    <div className="mb-8 flex flex-col items-center space-y-4 md:space-y-6">
      <div className="rounded-lg bg-slate-800 p-8">
        <div className="flex w-full items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-xl font-medium md:text-3xl">{t('mainTitle')}</h2>
            <Link href="/info">
              <p className="text-sm font-light hover:underline">
              {t('infoLink')}
              </p>
            </Link>
          </div>
        
        </div>
        <div className="mt-3 rounded-lg bg-gray-700 p-2">
          <AlertNotification userId={userId} />
        </div>

        <SignalsList userId={userId} />
      </div>
    </div>
  );
};

export default SignalsLayout;
