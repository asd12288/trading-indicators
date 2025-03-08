import { Link } from "@/i18n/routing";
import { Clock, Globe, Heart, Shield, Zap } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trader Map | About Us",
    description:
      "Learn about Trader Map's mission to empower traders with real-time insights and smart alerts",
  };
}

export default async function AboutUsPage() {
  const t = await getTranslations("AboutUs");

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-slate-300">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-slate-900/50 py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              {t("story.title")}
            </h2>
            <div className="mx-auto h-1 w-20 rounded bg-blue-500"></div>
          </div>

          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="md:w-1/2">
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl shadow-xl">
                <Image
                  src="/images/about/trading-desk.jpg"
                  alt="Trading Workspace"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="md:w-1/2">
              <p className="mb-6 text-lg text-slate-300">
                {t("story.paragraph1")}
              </p>
              <p className="mb-6 text-lg text-slate-300">
                {t("story.paragraph2")}
              </p>
              <p className="text-lg text-slate-300">{t("story.paragraph3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              {t("stats.title")}
            </h2>
            <div className="mx-auto h-1 w-20 rounded bg-blue-500"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                value: "50+",
                label: t("stats.instruments"),
                icon: <Globe className="h-8 w-8 text-blue-400" />,
              },
              {
                value: "24/7",
                label: t("stats.monitoring"),
                icon: <Clock className="h-8 w-8 text-indigo-400" />,
              },
              {
                value: "10k+",
                label: t("stats.alerts"),
                icon: <Zap className="h-8 w-8 text-purple-400" />,
              },
              {
                value: "99.9%",
                label: t("stats.uptime"),
                icon: <Shield className="h-8 w-8 text-emerald-400" />,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-center backdrop-blur-sm"
              >
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-slate-900/80 p-4">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="mb-2 text-3xl font-bold text-white">
                  {stat.value}
                </h3>
                <p className="text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-slate-900/50 py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              {t("values.title")}
            </h2>
            <div className="mx-auto h-1 w-20 rounded bg-blue-500"></div>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              {t("values.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: t("values.innovation.title"),
                description: t("values.innovation.description"),
                icon: <Zap className="h-10 w-10 text-blue-400" />,
              },
              {
                title: t("values.integrity.title"),
                description: t("values.integrity.description"),
                icon: <Shield className="h-10 w-10 text-indigo-400" />,
              },
              {
                title: t("values.community.title"),
                description: t("values.community.description"),
                icon: <Heart className="h-10 w-10 text-red-400" />,
              },
            ].map((value, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-6"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/80 p-4">
                  {value.icon}
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  {value.title}
                </h3>
                <p className="text-slate-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              {t("team.title")}
            </h2>
            <div className="mx-auto h-1 w-20 rounded bg-blue-500"></div>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              {t("team.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Alex Johnson",
                title: t("team.roles.ceo"),
                image: "/images/team/placeholder1.jpg",
                description: t("team.descriptions.ceo"),
              },
              {
                name: "Maria Rodriguez",
                title: t("team.roles.cto"),
                image: "/images/team/placeholder2.jpg",
                description: t("team.descriptions.cto"),
              },
              {
                name: "David Kim",
                title: t("team.roles.head_of_research"),
                image: "/images/team/placeholder3.jpg",
                description: t("team.descriptions.head_of_research"),
              },
            ].map((member, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-center backdrop-blur-sm"
              >
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-slate-700">
                  <div className="h-full w-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                </div>
                <h3 className="mb-1 text-xl font-bold text-white">
                  {member.name}
                </h3>
                <p className="mb-4 text-blue-400">{member.title}</p>
                <p className="text-slate-300">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="rounded-xl border border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 p-10 text-center shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
              {t("cta.description")}
            </p>
            <div className="flex flex-col justify-center gap-4 md:flex-row">
              <Link
                href="/contact"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white transition-all hover:from-blue-700 hover:to-indigo-700"
              >
                {t("cta.contact_us")}
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-slate-600 bg-slate-800 px-6 py-3 font-bold text-white transition-all hover:bg-slate-700"
              >
                {t("cta.get_started")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
