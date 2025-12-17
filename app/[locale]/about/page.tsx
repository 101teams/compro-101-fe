// app/about/page.tsx
"use client";
export const dynamic = "force-dynamic";
import { useLocale, useTranslations } from "next-intl";
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

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  const cleanBaseApi = (BASE_API || "").replace(/\/$/, "");
  if (imagePath.startsWith("/")) {
    return `${cleanBaseApi}${imagePath}`;
  }

  return `${cleanBaseApi}/${imagePath}`;
};

export default function AboutPage() {
  const locale = useLocale();
  const t = useTranslations("about");
  const {
    data: aboutData,
    error: aboutError,
    isLoading,
  } = useSWR([ENDPOINT.ABOUT, locale], ([url, locale]) => fetcher(url, locale));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-primary-white text-xl">{t("loading")}</p>
      </div>
    );
  }

  if (aboutError) {
    console.error("About page error:", aboutError);
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-primary-white text-xl mb-4">{t("errorTitle")}</p>
        <p className="text-primary-white text-sm opacity-70">
          {t("errorMessage")}
        </p>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-primary-white text-xl">{t("noData")}</p>
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

  return (
    <main className="relative overflow-hidden !scroll-smooth min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {t("title")}{" "}
                <span className="text-blue-500">{t("teamName")}</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                {t("subtitle")}
              </p>
            </div>

            {/* Right Column - Image */}
            {thumbnail && thumbnail.url && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={getImageUrl(thumbnail.url)}
                  alt={thumbnail.alternativeText || t("aboutImageAlt")}
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
            {t("ourStory")}
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
            {t("ourValues")}
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
              {gallery_title || t("ourGallery")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((image: any, index: number) => (
                <div
                  key={image.id}
                  className="relative rounded-xl overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={getImageUrl(image.url)}
                    alt={
                      image.alternativeText ||
                      `${t("galleryImageAlt")} ${index + 1}`
                    }
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
                <h2 className="text-3xl md:text-4xl font-bold">
                  {t("ourWork")}
                </h2>
                <p className="text-xl text-gray-300">
                  {work || t("workDescription")}
                </p>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                  {t("viewOurWork")}
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
                    alt={workcta_thumbnail.alternativeText || t("workImageAlt")}
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
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            {t("getInTouch")}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {contact || t("contactDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              {t("contactUs")}
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
              {t("ourServices")}
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
