"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import {
  CookieConsentLevel,
  getConsentLevel,
  setConsentLevel,
  clearAllCookies,
} from "@/lib/cookies";

export default function CookiesPage() {
  const t = useTranslations("cookiesPage");
  const locale = useLocale();
  const [currentConsent, setCurrentConsent] = useState<CookieConsentLevel | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setCurrentConsent(getConsentLevel());
  }, []);

  const handleConsentChange = (level: CookieConsentLevel) => {
    setConsentLevel(level);
    setCurrentConsent(level);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleClearAll = () => {
    clearAllCookies();
    setCurrentConsent(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <main className="relative overflow-hidden !scroll-smooth min-h-screen bg-black text-white">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          {t("title")}
        </h1>
        <p className="text-gray-300 mb-4">{t("intro")}</p>

        <div className="space-y-6 mt-8">
          <section>
            <h2 className="text-xl font-semibold mb-2">
              {t("whatWeStore.title")}
            </h2>
            <p className="text-gray-300 mb-2">
              {t("whatWeStore.description")}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
              <li>
                <code>cookie_consent</code> – {t("whatWeStore.items.consent")}
              </li>
              <li>
                <code>locale</code> – {t("whatWeStore.items.locale")}
              </li>
              <li>
                <code>prefs</code> – {t("whatWeStore.items.prefs")}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {t("retention.title")}
            </h2>
            <p className="text-gray-300 text-sm">
              {t("retention.description")}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {t("noTracking.title")}
            </h2>
            <p className="text-gray-300 text-sm">
              {t("noTracking.description")}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {t("analytics.title")}
            </h2>
            <p className="text-gray-300 text-sm">
              {t("analytics.description")}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {t("manage.title")}
            </h2>
            <p className="text-gray-300 text-sm mb-4">
              {t("manage.description")}
            </p>
            
            <div className="bg-[#0A1623] rounded-lg p-4 border border-white/10">
              <p className="text-sm text-gray-300 mb-3">
                {t("manage.currentChoice")}:{" "}
                <span className="font-semibold text-white">
                  {currentConsent 
                    ? t(`manage.choices.${currentConsent}`)
                    : t("manage.choices.none")
                  }
                </span>
              </p>
              
              {showSuccess && (
                <div className="mb-3 p-2 bg-green-500/20 border border-green-500/30 rounded text-sm text-green-300">
                  {t("manage.success")}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleConsentChange("essential")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentConsent === "essential"
                      ? "bg-white text-[#0A1623]"
                      : "border border-white/20 bg-transparent text-white hover:bg-white/10"
                  }`}
                >
                  {t("manage.buttons.essential")}
                </button>
                <button
                  onClick={() => handleConsentChange("marketing")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentConsent === "marketing"
                      ? "bg-white text-[#0A1623]"
                      : "border border-white/20 bg-transparent text-white hover:bg-white/10"
                  }`}
                >
                  {t("manage.buttons.acceptAll")}
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 bg-transparent text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  {t("manage.buttons.clearAll")}
                </button>
              </div>
            </div>
          </section>

          <div className="mt-8">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              {t("back")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


