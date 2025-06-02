import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, defaultLocale } from "@/i18n/config";
import { Navbar, Footer } from "@/components";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Use default locale if none is provided
  const currentLocale = locale || defaultLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(currentLocale as any)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../locales/${currentLocale}/common.json`))
      .default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={currentLocale} suppressHydrationWarning={true}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={currentLocale} messages={messages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
