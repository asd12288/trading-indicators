
import {
  Shield,
  Database,
  UserCog,
  FileText,
  RefreshCw,
  Mail,
} from "lucide-react";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "Privacy Policy",
};

const PolicySection = ({
  title,
  content,
  icon: Icon,
}: {
  title: string;
  content: string;
  icon: React.ElementType;
}) => {
  return (
    <div className="mt-8 rounded-xl bg-slate-700/50 p-6 transition-all hover:bg-slate-700/70">
      <div className="mb-3 flex items-center gap-3">
        <div className="bg-primary/20 rounded-full p-2">
          <Icon className="text-primary h-5 w-5" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
      </div>
      <p className="leading-relaxed text-slate-300">{content}</p>
    </div>
  );
};

const PrivacyPolicy = () => {
  const t = useTranslations("PrivacyPolicy");

  const sections = [
    { key: "collect", icon: Database },
    { key: "use", icon: UserCog },
    { key: "security", icon: Shield },
    { key: "rights", icon: FileText },
    { key: "changes", icon: RefreshCw },
    { key: "contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-12 text-slate-200 md:px-16">
      <div className="mx-auto max-w-4xl rounded-xl bg-slate-800/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-6 border-b border-slate-600 pb-6">
          <h1 className="from-primary bg-gradient-to-r text-slate-50 to-blue-400 bg-clip-text text-4xl font-bold text-transparent">
            {t("title")}
          </h1>
          <div className="mt-4 inline-flex items-center rounded-full bg-slate-700/50 px-4 py-1.5 text-sm">
            <span className="mr-2 font-medium text-slate-300">
              {t("effectiveDate")}
            </span>
            <span className="text-primary font-semibold">2025-01-01</span>
          </div>
        </div>

        {sections.map(({ key, icon }) => (
          <PolicySection
            key={key}
            title={t(`sections.${key}.title`)}
            content={t(`sections.${key}.content`)}
            icon={icon}
          />
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
