export type CookieConsentLevel = "essential" | "analytics" | "marketing";

export const COOKIE_NAMES = {
  consent: "cookie_consent",
  locale: "locale",
  preferences: "prefs", // JSON string for lightweight preferences
} as const;

export interface Preferences {
  viewMode?: "slider" | "grid";
  dismissedModals?: string[];
}

export const getBrowserCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
  return value ? decodeURIComponent(value) : null;
};

export const setBrowserCookie = (
  name: string,
  value: string,
  options: {
    days?: number;
    path?: string;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
  } = {}
) => {
  if (typeof document === "undefined") return;

  const { days = 180, path = "/", sameSite = "Lax", secure = false } = options;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  let cookieString = `${name}=${encodeURIComponent(
    value
  )};expires=${expires.toUTCString()};path=${path};sameSite=${sameSite}`;

  if (secure) {
    cookieString += ";secure";
  }

  document.cookie = cookieString;
};

export const deleteBrowserCookie = (name: string, path: string = "/") => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
};

export const getConsentLevel = (): CookieConsentLevel | null => {
  const value = getBrowserCookie(COOKIE_NAMES.consent);
  if (!value) return null;
  if (value === "essential" || value === "analytics" || value === "marketing") {
    return value;
  }
  return null;
};

export const setConsentLevel = (level: CookieConsentLevel) => {
  setBrowserCookie(COOKIE_NAMES.consent, level, { days: 365 });
};

export const getPreferences = (): Preferences => {
  const raw = getBrowserCookie(COOKIE_NAMES.preferences);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const setPreferences = (prefs: Preferences) => {
  const current = getPreferences();
  const merged: Preferences = {
    ...current,
    ...prefs,
    dismissedModals: Array.from(
      new Set([
        ...(current.dismissedModals || []),
        ...(prefs.dismissedModals || []),
      ])
    ),
  };

  setBrowserCookie(COOKIE_NAMES.preferences, JSON.stringify(merged), {
    days: 365,
  });
};

export const hasConsent = (level: CookieConsentLevel): boolean => {
  const current = getConsentLevel();
  if (!current) return false;

  const levels: CookieConsentLevel[] = ["essential", "analytics", "marketing"];
  const currentIndex = levels.indexOf(current);
  const requiredIndex = levels.indexOf(level);

  return currentIndex >= requiredIndex;
};

export const clearAllCookies = () => {
  deleteBrowserCookie(COOKIE_NAMES.consent);
  deleteBrowserCookie(COOKIE_NAMES.preferences);
};
