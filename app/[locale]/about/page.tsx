// app/about/page.tsx
import ENDPOINT from "@/constant/endpoint";
import { notFound } from "next/navigation";
import AboutPageClient from "@/components/AboutPageClient";

type AboutData = any;

interface AboutPageProps {
  params: { locale: string };
}

async function fetchAbout(locale: string): Promise<AboutData | null> {
  const separator = ENDPOINT.ABOUT.includes("?") ? "&" : "?";
  const urlWithLocale = `${ENDPOINT.ABOUT}${separator}locale=${locale}&populate=*`;

  const res = await fetch(urlWithLocale, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json?.data ?? null;
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
  const aboutData = await fetchAbout(locale);

  if (!aboutData) {
    notFound();
  }

  return <AboutPageClient aboutData={aboutData} locale={locale} />;
}

