"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { BASE_API } from "@/constant/endpoint";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Grid3X3,
  Layout,
  ArrowRight,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { BlocksRenderer } from "@/components/BlocksRenderer";
import { BlocksContent } from "@strapi/blocks-react-renderer";

interface WorkDetail {
  id: number;
  title: string;
  description: string;
  summary: string;
  slug: string;
  article: BlocksContent;
  image: Array<{
    id: number;
    url: string;
    formats: {
      small: { url: string };
      medium: { url: string };
      thumbnail: { url: string };
    };
  }>;
  service: {
    id: number;
    title: string;
  };
  category: {
    id: number;
    title: string;
  };
}

interface WorkItem {
  id: number;
  title: string;
  description: string;
  slug: string;
  image: Array<{
    id: number;
    url: string;
    formats?: {
      small?: { url: string };
      medium?: { url: string };
      thumbnail?: { url: string };
    };
  }>;
  service: {
    id: number;
    title: string;
  };
  category: {
    id: number;
    title: string;
  };
}

const WorkDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const tr = useTranslations("workDetails");
  const [work, setWork] = useState<WorkDetail | null>(null);
  const [relatedWorks, setRelatedWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Animation variants
  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  useEffect(() => {
    const fetchWorkDetail = async () => {
      try {
        const locale = params.locale as string;
        const response = await fetch(
          `${BASE_API}/api/works?locale=${locale}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.data && data.data.length > 0) {
          // Find the work with matching slug
          const workData = data.data.find(
            (work: any) => work.slug === params.slug
          );

          if (workData) {
            // Transform the data to match our interface
            const transformedWork: WorkDetail = {
              id: workData.id,
              title: workData.title,
              description: workData.description,
              summary: workData.summary,
              slug: workData.slug,
              article:
                typeof workData.article === "string"
                  ? JSON.parse(workData.article)
                  : workData.article || [],
              image:
                workData.image?.map((img: any) => ({
                  id: img.id,
                  url: img.url,
                  formats: img.formats,
                })) || [],
              service: workData.service
                ? {
                    id: workData.service.id,
                    title: workData.service.title,
                  }
                : {
                    id: 0,
                    title: "Uncategorized",
                  },
              category: workData.category
                ? {
                    id: workData.category.id,
                    title: workData.category.title,
                  }
                : {
                    id: 0,
                    title: "Uncategorized",
                  },
            };
            setWork(transformedWork);

            // Find related works (same category or service)
            const related = data.data.filter((item: any) => {
              if (!item.service || !item.category) return false;
              return (
                item.slug !== params.slug &&
                (item.category.id === workData.category?.id ||
                  item.service.id === workData.service?.id)
              );
            });

            // Transform related works to match our interface
            const transformedRelated = related.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              slug: item.slug,
              image:
                item.image?.map((img: any) => ({
                  id: img.id,
                  url: img.url,
                  formats: img.formats,
                })) || [],
              service: {
                id: item.service?.id || 0,
                title: item.service?.title || "Uncategorized",
              },
              category: {
                id: item.category?.id || 0,
                title: item.category?.title || "Uncategorized",
              },
            }));

            // Shuffle the related works array
            const shuffledRelated = transformedRelated.sort(
              () => Math.random() - 0.5
            );
            const selectedRelated = shuffledRelated.slice(0, 3);

            // If not enough related works, add some random ones
            if (selectedRelated.length < 3) {
              const randomWorks = data.data
                .filter(
                  (item: any) =>
                    item.slug !== params.slug &&
                    !selectedRelated.some((r: WorkItem) => r.id === item.id)
                )
                .sort(() => Math.random() - 0.5)
                .slice(0, 3 - selectedRelated.length)
                .map((item: any) => ({
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  slug: item.slug,
                  image:
                    item.image?.map((img: any) => ({
                      id: img.id,
                      url: img.url,
                      formats: img.formats,
                    })) || [],
                  service: {
                    id: item.service?.id || 0,
                    title: item.service?.title || "Uncategorized",
                  },
                  category: {
                    id: item.category?.id || 0,
                    title: item.category?.title || "Uncategorized",
                  },
                }));

              setRelatedWorks([...selectedRelated, ...randomWorks]);
            } else {
              setRelatedWorks(selectedRelated);
            }
          } else {
            setError(tr("notFound.description"));
          }
        } else {
          setError(tr("notFound.description"));
        }
      } catch (error) {
        console.error("Error fetching work detail:", error);
        setError(tr("notFound.description"));
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchWorkDetail();
    }
  }, [params.slug, params.locale, tr]);

  const handleGoBack = () => {
    const locale = params.locale as string;
    router.push(`/${locale}/#work`);
  };

  const handleImageClick = (index: number) => {
    if (viewMode === "grid") {
      setSelectedImage(index);
      setViewMode("slider");
    }
  };

  const navigateToWork = (slug: string) => {
    const locale = params.locale as string;
    router.push(`/${locale}/work/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(12,30,49)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary-white border-t-transparent animate-spin"></div>
          <div className="text-primary-white text-xl">{tr("loading")}</div>
        </div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-[rgb(12,30,49)] flex items-center justify-center">
        <div className="text-primary-white text-xl bg-[rgba(255,255,255,0.1)] p-8 rounded-xl backdrop-blur-sm">
          {error || tr("notFound.title")}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-[rgb(12,30,49)] text-white pb-20"
    >
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
        {work.image && work.image.length > 0 && (
          <div className="absolute inset-0">
            <Image
              src={`${BASE_API}${work.image[0].url}`}
              alt={work.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(12,30,49,0.6)] to-[rgb(12,30,49)]"></div>
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 p-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push("/#work")}
            className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to all works</span>
          </motion.button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <motion.div
            variants={fadeInUp}
            custom={1}
            initial="initial"
            animate="animate"
            className="flex flex-wrap gap-3 mb-3"
          >
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {work.category.title}
            </span>
            <span className="bg-[rgba(255,255,255,0.15)] text-white px-3 py-1 rounded-full text-sm font-medium">
              {work.service.title}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            custom={2}
            initial="initial"
            animate="animate"
            className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight"
          >
            {work.title}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-8">
        {/* Gallery Controls */}
        <motion.div
          variants={fadeInUp}
          custom={3}
          initial="initial"
          animate="animate"
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-2xl font-semibold text-white">{tr("gallery")}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("slider")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "slider"
                  ? "bg-blue-500 text-white"
                  : "bg-[rgba(255,255,255,0.1)] text-gray-300"
              }`}
            >
              <Layout size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-[rgba(255,255,255,0.1)] text-gray-300"
              }`}
            >
              <Grid3X3 size={20} />
            </button>
          </div>
        </motion.div>

        {/* Image Gallery */}
        {work.image && work.image.length > 0 && (
          <motion.div
            variants={fadeInUp}
            custom={4}
            initial="initial"
            animate="animate"
            className="w-full mb-16"
          >
            {viewMode === "slider" ? (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={0}
                  initialSlide={selectedImage || 0}
                  loop={true}
                  effect="fade"
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  navigation={true}
                  modules={[Pagination, Navigation, EffectFade]}
                  className="gallery-swiper"
                >
                  {work.image.map((image) => (
                    <SwiperSlide key={image.id}>
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={`${BASE_API}${image.url}`}
                          alt={work.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {work.image.map((image, index) => (
                  <motion.div
                    key={image.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => handleImageClick(index)}
                    className="cursor-pointer overflow-hidden rounded-lg shadow-lg aspect-[4/3] relative"
                  >
                    <Image
                      src={`${BASE_API}${image.url}`}
                      alt={`${work.title} - image ${index + 1}`}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <ExternalLink className="text-white" size={24} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Section */}
          <motion.div
            variants={fadeInUp}
            custom={5}
            initial="initial"
            animate="animate"
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <h2 className="text-2xl font-semibold mb-4 text-white border-b border-blue-500 pb-2 inline-block">
                {tr("overview")}
              </h2>
              <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-xl backdrop-blur-sm">
                <p className="text-lg text-gray-200 mb-6">{work.summary}</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase">
                      {tr("categories")}
                    </h3>
                    <p className="text-white">{work.category.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase">
                      {tr("services")}
                    </h3>
                    <p className="text-white">{work.service.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.div
            variants={fadeInUp}
            custom={6}
            initial="initial"
            animate="animate"
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-semibold mb-6 text-white border-b border-blue-500 pb-2 inline-block">
              {tr("details")}
            </h2>
            <div className="prose prose-lg max-w-none prose-invert">
              <div className="text-gray-200 leading-relaxed whitespace-pre-line text-lg bg-[rgba(255,255,255,0.05)] p-8 rounded-xl backdrop-blur-sm">
                {work.description}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Article Section */}
        {work.article && (
          <motion.div
            variants={fadeInUp}
            custom={7}
            initial="initial"
            animate="animate"
            className="mt-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <FileText className="text-blue-400" size={28} />
              <h2 className="text-2xl md:text-3xl font-bold text-white border-b border-blue-500 pb-2">
                {tr("article")}
              </h2>
            </div>

            <div className="bg-[rgba(255,255,255,0.02)] p-8 md:p-12 rounded-2xl backdrop-blur-sm shadow-2xl border border-[rgba(255,255,255,0.1)]">
              <div className="prose prose-lg prose-invert max-w-none">
                <BlocksRenderer content={work.article} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Explore More Works Section */}
      {relatedWorks.length > 0 && (
        <motion.div
          variants={fadeInUp}
          custom={8}
          initial="initial"
          animate="animate"
          className="max-w-7xl mx-auto px-6 md:px-8 mt-16 mb-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {tr("exploreMore")}
            </h2>
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/${params.locale}/#work`)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              {tr("viewAll")}
              <ArrowRight size={18} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedWorks.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => navigateToWork(item.slug)}
              >
                {item.image && item.image[0] && (
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={`${BASE_API}${item.image[0].url}`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,30,49,0.8)] to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-4">
                        <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {item.category.title}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center justify-between group">
                    {item.title}
                    <ArrowUpRight
                      size={18}
                      className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      {item.service.title}
                    </span>
                    <span className="h-8 w-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center hover:bg-blue-500 transition-colors">
                      <ArrowRight size={16} className="text-white" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WorkDetailPage;
