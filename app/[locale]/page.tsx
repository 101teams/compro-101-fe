// app/page.tsx
import {
  Featured,
  Hero,
  Services,
  WorkDisplay,
  WorkGallery,
} from "@/components";
import ENDPOINT from "@/constant/endpoint";
import Clients from "@/components/Clients";
import { CategoryDataProps, ServiceDataProps, WorksDataProps, ClientsLogoProps } from "@/types";

async function fetchWithLocale<T>(url: string, locale: string): Promise<T> {
  const separator = url.includes("?") ? "&" : "?";
  const urlWithLocale = `${url}${separator}locale=${locale}&populate=*`;

  const request = await fetch(urlWithLocale, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    // Revalidate periodically – adjust as needed
    next: { revalidate: 60 },
  });

  if (!request.ok) {
    throw new Error(`API request failed with status ${request.status}`);
  }

  const response = await request.json();
  return response.data;
}

interface HomePageProps {
  params: { locale: string };
}

export default async function Home({ params: { locale } }: HomePageProps) {
  const [services, categories, works, clients] = await Promise.all([
    fetchWithLocale<ServiceDataProps[]>(ENDPOINT.SERVICES, locale),
    fetchWithLocale<CategoryDataProps[]>(ENDPOINT.CATEGORY, locale),
    fetchWithLocale<WorksDataProps[]>(ENDPOINT.WORKS, locale),
    fetchWithLocale<ClientsLogoProps[]>(ENDPOINT.CLIENTS, locale),
  ]);

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
