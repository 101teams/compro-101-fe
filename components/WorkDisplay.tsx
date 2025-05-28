"use client";
import React, { useState } from "react";
import WorkCategory from "./WorkCategory";
import Image from "next/image";
import { BASE_API } from "@/constant/endpoint";
import { MoveRight, MoveLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Navigation, Pagination } from "swiper/modules";
import { WorkDisplayComponentProps } from "@/types";
import { useTranslations } from "next-intl";

const ITEMS_PER_PAGE = 3;
const buttonVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};
const WorkDisplay = ({ categories, works }: WorkDisplayComponentProps) => {
  const tr = useTranslations("works");
  const router = useRouter();
  // Get the first category from the categories array as the initial selected category
  const initialCategory = categories?.[0]?.title || "Android App Development";
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [displayedCount, setDisplayedCount] = useState<number>(ITEMS_PER_PAGE);

  // Guard clause for empty data
  if (!categories || !works) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <p className="text-primary-white text-xl">No data available</p>
      </div>
    );
  }

  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
    setDisplayedCount(ITEMS_PER_PAGE); // Reset displayed count when category changes
  };

  // Safely filter works with null checks
  const filteredWorks = works.filter((work) => {
    // If no category is selected, show all works
    if (!selectedCategory) return true;

    // Show all works if the selected category is "All"
    if (selectedCategory === "All") return true;

    // Check if work has a category and if it matches the selected category
    const categoryTitle = work.category?.title;
    return categoryTitle === selectedCategory;
  });

  // Get the works to display based on the current count
  const displayedWorks = filteredWorks.slice(0, displayedCount);
  const hasMoreWorks = displayedCount < filteredWorks.length;
  const hasMoreThanInitial = displayedCount > ITEMS_PER_PAGE;

  const handleSeeMore = () => {
    setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleSeeLess = () => {
    setDisplayedCount(ITEMS_PER_PAGE);
    // Smooth scroll to the top of the work section
    const workSection = document.getElementById("work");
    if (workSection) {
      workSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Add "All" category to the list
  const allCategories = [{ id: "all", title: "All" }, ...categories];

  // Animation variants for staggered animations
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const workItemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const navigateToWork = (slug: string) => {
    const currentLocale = window.location.pathname.split("/")[1];
    router.push(`/${currentLocale}/work/${slug}`);
  };

  return (
    <section
      className="max-container padding-x py-12 md:py-16 lg:py-24"
      id="work"
    >
      <div className="mx-auto">
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-primary-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            {tr("title")}
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-3xl">
            {tr("subtitle")}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
            {allCategories.map((category) => {
              if (!category?.title) return null;
              return (
                <WorkCategory
                  key={category.id}
                  category={category.title}
                  onClick={() => handleSelectedCategory(category.title)}
                  isActive={selectedCategory === category.title}
                />
              );
            })}
          </div>
          <div className="h-px w-full bg-gray-800 mb-8 md:mb-12"></div>
          <div className="display__work-container mt-8 md:mt-12">
            {displayedWorks.length > 0 ? (
              <>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-8 md:gap-12 lg:gap-16"
                >
                  {displayedWorks.map((work, index) => {
                    if (!work) return null;
                    return (
                      <motion.div
                        className="work-card bg-[#0C1E31]/50 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
                        key={work.id}
                        variants={workItemVariant}
                      >
                        {/* Image Section */}
                        <div className="relative">
                          {work.image && work.image.length > 0 ? (
                            <Swiper
                              slidesPerView={1}
                              spaceBetween={0}
                              loop={true}
                              pagination={{
                                clickable: true,
                                dynamicBullets: true,
                              }}
                              navigation={true}
                              modules={[Pagination, Navigation]}
                              className="work-swiper"
                            >
                              {work.image.map((image, imageIndex) => (
                                <SwiperSlide key={image.id}>
                                  <div className="aspect-w-16 aspect-h-9 w-full">
                                    <Image
                                      src={`${BASE_API}${image.url}`}
                                      alt={`${work.title || "Project"} image ${
                                        imageIndex + 1
                                      }`}
                                      width={1200}
                                      height={675}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          ) : (
                            <div className="bg-gray-900 w-full aspect-w-16 aspect-h-9 flex justify-center items-center">
                              <p className="text-gray-400 text-sm">
                                No images available
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-4 md:p-6 lg:p-8">
                          {/* Category Label */}
                          <div className="mb-3 md:mb-4">
                            <span className="text-xs uppercase tracking-wider bg-gray-800 text-blue-400 px-2 md:px-3 py-1 rounded-full">
                              {work.category?.title || "Uncategorized"}
                            </span>
                          </div>

                          {/* Title and Summary */}
                          <div className="mb-4 md:mb-6">
                            <h2 className="text-primary-white text-xl md:text-2xl font-medium mb-2 md:mb-3">
                              {work.title || "Untitled Work"}
                            </h2>
                            <p className="text-gray-400 text-sm md:text-base">
                              {work.summary || "No summary available"}
                            </p>
                          </div>

                          {/* Description */}
                          <div className="mb-6 md:mb-8">
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                              {work.description || "No description available"}
                            </p>
                          </div>

                          {/* Action Button */}
                          <div className="flex justify-end">
                            <button
                              onClick={() => navigateToWork(work.slug)}
                              className="group flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm md:text-base"
                            >
                              {tr("button")}
                              <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition-transform"
                              />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Pagination Controls */}
                <div className="flex justify-center gap-3 mt-12 md:mt-16">
                  <AnimatePresence>
                    {hasMoreWorks && (
                      <motion.button
                        onClick={handleSeeMore}
                        className="flex items-center gap-2 px-4 md:px-5 py-2 bg-transparent border border-gray-700 text-gray-300 rounded-md hover:bg-gray-800 transition-colors text-sm md:text-base"
                        variants={buttonVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <span>Load More</span>
                        <MoveRight size={16} />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {hasMoreThanInitial && (
                      <motion.button
                        onClick={handleSeeLess}
                        className="flex items-center gap-2 px-4 md:px-5 py-2 bg-transparent border border-gray-700 text-gray-300 rounded-md hover:bg-gray-800 transition-colors text-sm md:text-base"
                        variants={buttonVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <MoveLeft size={16} />
                        <span>Show Less</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center bg-[#0C1E31]/50 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl shadow-black/60 min-h-[300px] md:min-h-[400px]">
                <p className="text-gray-400 text-base md:text-lg">
                  No projects found in this category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkDisplay;
