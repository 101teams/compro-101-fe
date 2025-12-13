"use client";
import React, { useEffect, useState, useRef } from "react";
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
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { BlocksRenderer } from "@/components/BlocksRenderer";
import { BlocksContent } from "@strapi/blocks-react-renderer";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/effect-fade";

interface MediaItem {
  id: number;
  url: string;
  mime: string;
  name: string;
  ext: string;
  alternativeText?: string;
  caption?: string;
  formats?: any;
  size: number;
  width?: number;
  height?: number;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
}

interface WorkDetail {
  id: number;
  title: string;
  description: string;
  summary: string;
  slug: string;
  article: BlocksContent;
  image: MediaItem[]; // This is actually media array (can contain both images and videos)
  service: {
    id: number;
    title: string;
  };
  category: {
    id: number;
    title: string;
  };
  createdAt: string;
  documentId: string;
}

interface WorkItem {
  id: number;
  title: string;
  description: string;
  slug: string;
  image: MediaItem[];
  service: {
    id: number;
    title: string;
  };
  category: {
    id: number;
    title: string;
  };
}

// Video Player Component
const VideoPlayer = ({
  src,
  poster,
  mime,
  autoPlay = false,
  controls = true,
  loop = true,
}: {
  src: string;
  poster?: string;
  mime: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setCurrentTime(currentTime);
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="relative w-full h-full group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        loop={loop}
        muted={isMuted}
        autoPlay={autoPlay}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Video Controls */}
      {controls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Progress Bar */}
          <div
            className="h-1.5 bg-gray-600 cursor-pointer mb-3 rounded-full overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-blue-500 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="text-white" size={16} />
                ) : (
                  <Play className="text-white" size={16} />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="text-white" size={14} />
                ) : (
                  <Volume2 className="text-white" size={14} />
                )}
              </button>
              <div className="text-white text-xs ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            <div className="text-xs text-gray-300">
              {mime.split("/")[1].toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Play Button Overlay for paused videos */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all transform hover:scale-110 backdrop-blur-sm group/play"
          >
            <Play className="text-white" size={28} fill="white" />
          </button>
        </div>
      )}

      {/* Video indicator badge */}
      <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
        <Film size={12} />
        <span>VIDEO</span>
      </div>
    </div>
  );
};

// Media Renderer Component
const MediaRenderer = ({
  media,
  isGrid = false,
  onClick,
}: {
  media: MediaItem;
  isGrid?: boolean;
  onClick?: () => void;
}) => {
  const isVideo = media.mime?.startsWith("video/");
  const isImage = media.mime?.startsWith("image/") || !media.mime;

  if (isVideo) {
    const thumbnail =
      media.previewUrl ||
      media.formats?.thumbnail?.url ||
      media.formats?.small?.url;
    return (
      <div className="relative w-full h-full" onClick={onClick}>
        <VideoPlayer
          src={`${BASE_API}${media.url}`}
          poster={thumbnail ? `${BASE_API}${thumbnail}` : undefined}
          mime={media.mime}
          autoPlay={false}
          controls={!isGrid}
          loop={true}
        />
        {isGrid && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="bg-black/60 p-3 rounded-full">
              <Play className="text-white" size={24} fill="white" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="relative w-full h-full" onClick={onClick}>
        <Image
          src={`${BASE_API}${media.url}`}
          alt={media.alternativeText || "Image content"}
          fill
          className="object-cover"
          sizes={
            isGrid
              ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              : "100vw"
          }
        />
        {isGrid && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
            <ExternalLink className="text-white" size={24} />
          </div>
        )}
      </div>
    );
  }

  return null;
};

// Media type badge component
const MediaTypeBadge = ({ mime }: { mime: string }) => {
  const isVideo = mime?.startsWith("video/");
  const isImage = mime?.startsWith("image/") || !mime;

  if (isVideo) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-md text-xs">
        <Film size={12} />
        <span>Video</span>
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs">
        <ImageIcon size={12} />
        <span>Image</span>
      </div>
    );
  }

  return null;
};

const WorkDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const tr = useTranslations("workDetails");
  const [work, setWork] = useState<WorkDetail | null>(null);
  const [relatedWorks, setRelatedWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);

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
              summary:
                workData.summary ||
                workData.description.substring(0, 200) + "...",
              slug: workData.slug,
              article:
                typeof workData.article === "string"
                  ? JSON.parse(workData.article)
                  : workData.article || [],
              // Handle images and videos from the image array
              image: (workData.image || []).map((img: any) => ({
                id: img.id,
                url: img.url,
                mime: img.mime || "image/jpeg",
                name: img.name,
                ext: img.ext,
                alternativeText: img.alternativeText,
                caption: img.caption,
                formats: img.formats,
                size: img.size,
                width: img.width,
                height: img.height,
                previewUrl: img.previewUrl,
                provider: img.provider,
                provider_metadata: img.provider_metadata,
              })),
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
              createdAt: workData.createdAt,
              documentId: workData.documentId,
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
              image: (item.image || []).map((img: any) => ({
                id: img.id,
                url: img.url,
                mime: img.mime || "image/jpeg",
                name: img.name,
                ext: img.ext,
                alternativeText: img.alternativeText,
                caption: img.caption,
                formats: img.formats,
                size: img.size,
                width: img.width,
                height: img.height,
                previewUrl: img.previewUrl,
                provider: img.provider,
                provider_metadata: img.provider_metadata,
              })),
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
                  image: (item.image || []).map((img: any) => ({
                    id: img.id,
                    url: img.url,
                    mime: img.mime || "image/jpeg",
                    name: img.name,
                    ext: img.ext,
                    alternativeText: img.alternativeText,
                    caption: img.caption,
                    formats: img.formats,
                    size: img.size,
                    width: img.width,
                    height: img.height,
                    previewUrl: img.previewUrl,
                    provider: img.provider,
                    provider_metadata: img.provider_metadata,
                  })),
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

  const handleMediaClick = (index: number) => {
    if (viewMode === "grid") {
      setSelectedMedia(index);
      setViewMode("slider");
    }
  };

  const navigateToWork = (slug: string) => {
    const locale = params.locale as string;
    router.push(`/${locale}/work/${slug}`);
  };

  // Helper function to count media types
  const getMediaStats = () => {
    if (!work?.image) return { images: 0, videos: 0 };

    const images = work.image.filter(
      (m) => m.mime?.startsWith("image/") || !m.mime
    ).length;
    const videos = work.image.filter((m) =>
      m.mime?.startsWith("video/")
    ).length;

    return { images, videos };
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

  const mediaStats = getMediaStats();

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
            {work.image[0].mime?.startsWith("video/") ? (
              <VideoPlayer
                src={`${BASE_API}${work.image[0].url}`}
                mime={work.image[0].mime}
                autoPlay={true}
                controls={false}
                loop={true}
              />
            ) : (
              <Image
                src={`${BASE_API}${work.image[0].url}`}
                alt={work.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(12,30,49,0.6)] to-[rgb(12,30,49)]"></div>
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 p-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push("/#work")}
            className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg"
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
            {work.image &&
              work.image.length > 0 &&
              work.image[0].mime?.startsWith("video/") && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Film size={14} />
                  <span>Video Project</span>
                </span>
              )}
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
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {tr("gallery")}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {work.image.length} item{work.image.length !== 1 ? "s" : ""} •
              {mediaStats.images > 0 &&
                ` ${mediaStats.images} image${
                  mediaStats.images !== 1 ? "s" : ""
                }`}
              {mediaStats.images > 0 && mediaStats.videos > 0 && " • "}
              {mediaStats.videos > 0 &&
                ` ${mediaStats.videos} video${
                  mediaStats.videos !== 1 ? "s" : ""
                }`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("slider")}
              className={`p-2 rounded-md transition-all flex items-center gap-2 ${
                viewMode === "slider"
                  ? "bg-blue-500 text-white"
                  : "bg-[rgba(255,255,255,0.1)] text-gray-300 hover:bg-[rgba(255,255,255,0.15)]"
              }`}
            >
              <Layout size={20} />
              <span className="text-sm hidden sm:inline">Slider</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all flex items-center gap-2 ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-[rgba(255,255,255,0.1)] text-gray-300 hover:bg-[rgba(255,255,255,0.15)]"
              }`}
            >
              <Grid3X3 size={20} />
              <span className="text-sm hidden sm:inline">Grid</span>
            </button>
          </div>
        </motion.div>

        {/* Media Gallery */}
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
                  initialSlide={selectedMedia || 0}
                  loop={true}
                  effect="fade"
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                    renderBullet: function (index, className) {
                      const media = work.image[index];
                      const isVideo = media.mime?.startsWith("video/");
                      return `
                        <span class="${className} ${
                        isVideo ? "swiper-pagination-bullet-video" : ""
                      }">
                          ${isVideo ? "▶" : ""}
                        </span>`;
                    },
                  }}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  modules={[Pagination, Navigation, EffectFade]}
                  className="gallery-swiper"
                >
                  {work.image.map((media) => (
                    <SwiperSlide key={media.id}>
                      <div className="relative aspect-video">
                        <MediaRenderer media={media} />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                          <MediaTypeBadge mime={media.mime} />
                        </div>
                        <div className="text-sm text-gray-300 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
                          {media.name}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {work.image.map((media, index) => (
                  <motion.div
                    key={media.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => handleMediaClick(index)}
                    className="cursor-pointer overflow-hidden rounded-lg shadow-lg aspect-[4/3] relative group"
                  >
                    <MediaRenderer
                      media={media}
                      isGrid={true}
                      onClick={() => handleMediaClick(index)}
                    />
                    <div className="absolute top-2 left-2">
                      <MediaTypeBadge mime={media.mime} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm truncate">
                        {media.name}
                      </p>
                      <p className="text-gray-300 text-xs">
                        {media.size
                          ? `${(media.size / 1024).toFixed(1)} KB`
                          : ""}
                        {media.width && media.height
                          ? ` • ${media.width}×${media.height}`
                          : ""}
                      </p>
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
                    <h3 className="text-sm text-gray-400 uppercase mb-1">
                      {tr("categories")}
                    </h3>
                    <p className="text-white font-medium">
                      {work.category.title}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase mb-1">
                      {tr("services")}
                    </h3>
                    <p className="text-white font-medium">
                      {work.service.title}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase mb-1">
                      Media Content
                    </h3>
                    <div className="space-y-1">
                      <p className="text-white font-medium">
                        {work.image.length} total item
                        {work.image.length !== 1 ? "s" : ""}
                      </p>
                      {mediaStats.images > 0 && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <ImageIcon size={14} />
                          <span className="text-sm">
                            {mediaStats.images} image
                            {mediaStats.images !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                      {mediaStats.videos > 0 && (
                        <div className="flex items-center gap-2 text-red-400">
                          <Film size={14} />
                          <span className="text-sm">
                            {mediaStats.videos} video
                            {mediaStats.videos !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase mb-1">
                      Created
                    </h3>
                    <p className="text-white">
                      {new Date(work.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
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
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors bg-[rgba(255,255,255,0.05)] px-4 py-2 rounded-lg"
            >
              {tr("viewAll")}
              <ArrowRight size={18} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedWorks.map((item) => {
              const firstMedia = item.image?.[0];
              const isVideo = firstMedia?.mime?.startsWith("video/");

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                  onClick={() => navigateToWork(item.slug)}
                >
                  {firstMedia && (
                    <div className="relative h-56 overflow-hidden">
                      {isVideo ? (
                        <VideoPlayer
                          src={`${BASE_API}${firstMedia.url}`}
                          mime={firstMedia.mime}
                          autoPlay={false}
                          controls={false}
                          loop={true}
                        />
                      ) : (
                        <Image
                          src={`${BASE_API}${firstMedia.url}`}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,30,49,0.8)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                        <div className="p-4 flex gap-2">
                          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {item.category.title}
                          </span>
                          {isVideo && (
                            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                              <Film size={10} />
                              <span>Video</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center justify-between group-hover:text-blue-300 transition-colors">
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
                      <span className="h-8 w-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <ArrowRight size={16} className="text-white" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WorkDetailPage;
