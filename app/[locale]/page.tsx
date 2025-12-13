// app/page.tsx
"use client";
import {
  Featured,
  Hero,
  Services,
  WorkDisplay,
  WorkGallery,
} from "@/components";
import ENDPOINT from "@/constant/endpoint";
import useSWR from "swr";
import Clients from "@/components/Clients";
import { useLocale } from "next-intl";

const fetcher = async (url: string, locale: string) => {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const separator = url.includes("?") ? "&" : "?";
    const urlWithLocale = `${url}${separator}locale=${locale}&populate=*`;

    const request = await fetch(urlWithLocale, options);

    if (!request.ok) {
      throw new Error(`API request failed with status ${request.status}`);
    }

    const response = await request.json();
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default function Home() {
  const locale = useLocale();
  const { data: services, error: servicesError } = useSWR(
    [ENDPOINT.SERVICES, locale],
    ([url, locale]) => fetcher(url, locale)
  );
  const { data: categories, error: categoriesError } = useSWR(
    [ENDPOINT.CATEGORY, locale],
    ([url, locale]) => fetcher(url, locale)
  );
  const { data: works, error: worksError } = useSWR(
    [ENDPOINT.WORKS, locale],
    ([url, locale]) => fetcher(url, locale)
  );
  const { data: clients, error: clientsError } = useSWR(
    [ENDPOINT.CLIENTS, locale],
    ([url, locale]) => fetcher(url, locale)
  );
  const { data: abouts, error: aboutsError } = useSWR(
    [ENDPOINT.ABOUT, locale],
    ([url, locale]) => fetcher(url, locale)
  );

  console.log(abouts);

  // Handle loading state
  if (!services || !categories || !works) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-primary-white text-xl">Loading...</p>
      </div>
    );
  }

  // Handle error state
  if (servicesError || categoriesError || worksError || clientsError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-primary-white text-xl mb-4">Error loading data</p>
        <p className="text-primary-white text-sm opacity-70">
          Theres Somthing Wrong Please Try Again Later!
        </p>
      </div>
    );
  }

  return (
    <main className="relative overflow-hidden !scroll-smooth">
      <div className="backdrop__cirlce">
        <Hero />
      </div>
      <div className="service__backdrop">
        <Services services={services} categories={categories} />
      </div>
      <Clients clients={clients} />
      <Featured works={works} />
      <WorkGallery works={works} />
      <WorkDisplay works={works} categories={categories} />
    </main>
  );
}
