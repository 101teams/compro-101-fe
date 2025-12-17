"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  COOKIE_NAMES,
  CookieConsentLevel,
  getConsentLevel,
  setConsentLevel,
} from "@/lib/cookies";

const CookieBanner = () => {
  const t = useTranslations("cookies");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [currentConsent, setCurrentConsent] = useState<CookieConsentLevel | null>(null);

  useEffect(() => {
    const existing = getConsentLevel();
    setCurrentConsent(existing);
    if (!existing) {
      setVisible(true);
    }
  }, []);

  // Don't show banner on cookies page (they can manage there)
  useEffect(() => {
    if (pathname?.includes("/cookies")) {
      setVisible(false);
    }
  }, [pathname]);

  const handleConsent = (level: CookieConsentLevel) => {
    setConsentLevel(level);
    setCurrentConsent(level);
    setVisible(false);
  };

  // Allow reopening banner if consent exists (for changing preferences)
  const handleManageCookies = () => {
    setVisible(true);
  };

  if (!visible) {
    // Show a small "Manage cookies" button if consent exists
    if (currentConsent) {
      return (
        <button
          onClick={handleManageCookies}
          className="fixed bottom-4 right-4 z-30 rounded-lg bg-[#0A1623]/90 text-white text-xs px-3 py-2 border border-white/10 hover:bg-[#0A1623] transition-colors backdrop-blur"
          aria-label={t("manageCookies")}
        >
          {t("manageCookies")}
        </button>
      );
    }
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-30 w-full max-w-xl -translate-x-1/2 px-4">
      <div className="rounded-2xl bg-[#0A1623]/95 text-white shadow-2xl border border-white/10 p-4 sm:p-5 backdrop-blur">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-semibold mb-1">
              {t("title")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-200">
              {t("description")}
            </p>
          </div>

          <p className="text-[11px] sm:text-xs text-gray-400">
            {t("note")} <code className="text-[10px]">{COOKIE_NAMES.consent}</code>
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
            <button
              onClick={() => handleConsent("essential")}
              className="w-full sm:w-auto rounded-lg border border-white/20 bg-transparent px-3 py-2 text-xs sm:text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              {t("buttons.essential")}
            </button>
            {currentConsent && (
              <button
                onClick={() => setVisible(false)}
                className="w-full sm:w-auto rounded-lg border border-white/20 bg-transparent px-3 py-2 text-xs sm:text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                {t("buttons.cancel")}
              </button>
            )}
            <button
              onClick={() => handleConsent("marketing")}
              className="w-full sm:w-auto rounded-lg bg-white text-[#0A1623] px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              {t("buttons.acceptAll")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;


