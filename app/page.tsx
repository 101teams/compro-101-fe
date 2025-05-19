"use client";
import { Featured, Footer, Hero, Services, WorkDisplay } from "@/components";
import Image from "next/image";
import ENDPOINT from "@/constant/endpoint";
import { CategoryDataProps, ServiceDataProps, WorksDataProps } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const request = await fetch(url, options);

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
  const { data: services, error: servicesError } = useSWR(
    ENDPOINT.SERVICES,
    fetcher
  );
  const { data: categories, error: categoriesError } = useSWR(
    ENDPOINT.CATEGORY,
    fetcher
  );
  const { data: works, error: worksError } = useSWR(ENDPOINT.WORKS, fetcher);

  // Handle loading state
  if (!services || !categories || !works) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-primary-white text-xl">Loading...</p>
      </div>
    );
  }

  // Handle error state
  if (servicesError || categoriesError || worksError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-primary-white text-xl mb-4">Error loading data</p>
        <p className="text-primary-white text-sm opacity-70">
          Please check your API configuration and try again
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
      <Featured works={works} />
      <WorkDisplay works={works} categories={categories} />
    </main>
  );
}
