// app/about/page.tsx
"use client";

import { useLocale } from "next-intl";
import useSWR from "swr";
import ENDPOINT, { BASE_API } from "@/constant/endpoint";
import Image from "next/image";
import Link from "next/link";

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

// Remove these duplicate declarations - use the imported BASE_API
// const BASE_API = process.env.NEXT_PUBLIC_API_URL;
// const cleanBaseApi = BASE_API.replace(/\/$/, "");

// Helper function to build image URL
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";

  // Remove trailing slash from BASE_API if it exists
  const cleanBaseApi = BASE_API.replace(/\/$/, "");

  // If imagePath already has a leading slash, we need to combine it properly
  if (imagePath.startsWith("/")) {
    return `${cleanBaseApi}${imagePath}`;
  }

  return `${cleanBaseApi}/${imagePath}`;
};

export default function AboutPage() {
  const locale = useLocale();
  const {
    data: aboutData,
    error: aboutError,
    isLoading,
  } = useSWR([ENDPOINT.ABOUT, locale], ([url, locale]) => fetcher(url, locale));

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-primary-white text-xl">Loading...</p>
      </div>
    );
  }

  // Handle error state
  if (aboutError) {
    console.error("About page error:", aboutError);
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-primary-white text-xl mb-4">Error loading data</p>
        <p className="text-primary-white text-sm opacity-70">
          There's Something Wrong Please Try Again Later!
        </p>
      </div>
    );
  }

  // Handle case where data is undefined
  if (!aboutData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-primary-white text-xl">No data found</p>
      </div>
    );
  }

  const {
    story,
    values,
    contact,
    work,
    gallery_title,
    thumbnail,
    gallery,
    workcta_thumbnail,
  } = aboutData;

  // Debug logging
  console.log("About data:", aboutData);
  console.log("Locale:", locale);
  console.log("BASE_API:", BASE_API);

  if (thumbnail) {
    console.log("Thumbnail URL from data:", thumbnail.url);
    console.log("Built thumbnail URL:", getImageUrl(thumbnail.url));
  }

  return (
    <main className="relative overflow-hidden !scroll-smooth min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                About <span className="text-blue-500">101 Team</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                We bring structure to complexity and transform ambitious ideas
                into dependable, fully integrated technology solutions.
              </p>
            </div>

            {/* Right Column - Image */}
            {thumbnail && thumbnail.url && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={getImageUrl(thumbnail.url)}
                  alt={thumbnail.alternativeText || "About 101 Team"}
                  width={thumbnail.width || 800}
                  height={thumbnail.height || 440}
                  className="w-full h-auto object-cover"
                  priority
                  onError={(e) => {
                    console.error(
                      "Image failed to load:",
                      getImageUrl(thumbnail.url)
                    );
                    // You can add a fallback image here
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg prose-invert max-w-none">
            {story &&
              story.split("\n\n").map((paragraph: string, index: number) => (
                <p key={index} className="mb-6 text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values?.company_values?.map((value: any, index: number) => (
              <div
                key={index}
                className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-500 font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                </div>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {gallery && gallery.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {gallery_title || "Our Gallery"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((image: any, index: number) => (
                <div
                  key={image.id}
                  className="relative rounded-xl overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={getImageUrl(image.url)}
                    alt={image.alternativeText || `Gallery image ${index + 1}`}
                    width={image.width || 500}
                    height={image.height || 300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error(
                        "Gallery image failed to load:",
                        getImageUrl(image.url)
                      );
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Work CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Our Work</h2>
                <p className="text-xl text-gray-300">
                  {work || "Discover our portfolio of innovative projects."}
                </p>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                  View Our Work
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
              {workcta_thumbnail && workcta_thumbnail.url && (
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={getImageUrl(workcta_thumbnail.url)}
                    alt={workcta_thumbnail.alternativeText || "Our Work"}
                    width={workcta_thumbnail.width || 800}
                    height={workcta_thumbnail.height || 440}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      console.error(
                        "Work CTA image failed to load:",
                        getImageUrl(workcta_thumbnail.url)
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Get In Touch</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {contact || "Contact us to discuss your project."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Contact Us
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-700 hover:border-blue-500 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Our Services
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
