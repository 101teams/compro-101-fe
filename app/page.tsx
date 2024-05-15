"use client";
import { Featured, Footer, Hero, Services, WorkDisplay } from "@/components";
import Image from "next/image";
import ENDPOINT from "@/constant/endpoint";
import { CategoryDataProps, ServiceDataProps, WorksDataProps } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers":
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    },
  };
  const request = await fetch(url, options);
  const response = await request.json();
  return response.data;
};

export default function Home() {
  const { data: services } = useSWR(ENDPOINT.SERVICES, fetcher);
  const { data: categories } = useSWR(ENDPOINT.CATEGORY, fetcher, {});
  const { data: works } = useSWR(ENDPOINT.WORKS, fetcher, {});

  if (!services || !categories || !works) {
    return <div>Loading...</div>;
  }
  console.log(works);

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
      <Footer />
    </main>
  );
}
