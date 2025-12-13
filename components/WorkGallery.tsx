"use client";
import { BASE_API } from "@/constant/endpoint";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface WorkGalleryProps {
  works: any[];
}

export default function WorkGallery({ works }: WorkGalleryProps) {
  const t = useTranslations("workGallery");
  if (!works || works.length === 0) return null;
  const getImageData = (work: any) => {
    if (!work) return null;

    if (work.image?.[0]) return work.image[0];
    if (work.attributes?.image?.data?.[0]?.attributes)
      return work.attributes.image.data[0].attributes;
    if (work.image?.url) return work.image;
    if (work.thumbnail?.url) return work.thumbnail;
    return null;
  };

  const getTitle = (work: any): string => {
    return (
      work?.title || work?.attributes?.title || work?.name || "Untitled Work"
    );
  };

  const getImageUrl = (imageData: any): string => {
    if (!imageData?.url) return "";
    const cleanBaseApi = (BASE_API || "").replace(/\/$/, "");
    return `${cleanBaseApi}${imageData.url.startsWith("/") ? "" : "/"}${
      imageData.url
    }`;
  };

  const worksWithImages = works.filter((work) => getImageData(work) !== null);

  if (worksWithImages.length === 0) return null;

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {t("title")}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {worksWithImages.map((work, index) => {
            const imageData = getImageData(work);
            const imageUrl = getImageUrl(imageData);
            const title = getTitle(work);

            return (
              <div
                key={work.id || index}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
              >
                {/* Large Image Display with Next.js Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.src = "";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <span className="text-gray-600">{t("noImage")}</span>
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Title that slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="bg-black/90 backdrop-blur-md rounded-xl p-6 border border-white/10">
                      <h3 className="text-white text-2xl font-bold mb-3 line-clamp-2">
                        {title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-medium">
                          {t("learnMore")}
                        </span>
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 group-hover:rotate-45">
                          <svg
                            className="w-6 h-6 text-white"
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glassmorphism effect on hover */}
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              </div>
            );
          })}
        </div>

        {/* Stats/Counter */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                {worksWithImages.length}+
              </div>
              <div className="text-gray-400">{t("projectsCompleted")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">{t("clientSatisfaction")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">{t("supportAvailable")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
