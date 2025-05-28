import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./config";

export default getRequestConfig(async ({ locale }) => {
  // Use default locale if none is provided
  const currentLocale = locale || defaultLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(currentLocale as any)) {
    throw new Error(`Invalid locale: ${currentLocale}`);
  }

  return {
    locale: currentLocale,
    messages: (await import(`../locales/${currentLocale}/common.json`)).default,
  };
});
