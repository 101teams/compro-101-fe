import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/cookies";
import { defaultLocale, locales } from "@/i18n/config";

export default function RootPage() {
  const cookieStore = cookies();
  const savedLocale = cookieStore.get(COOKIE_NAMES.locale)?.value;

  const targetLocale =
    savedLocale && locales.includes(savedLocale as any)
      ? (savedLocale as (typeof locales)[number])
      : defaultLocale;

  redirect(`/${targetLocale}`);
}
