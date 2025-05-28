"use client";
import { useEffect, useRef, useState } from "react";
import ServiceCategory from "./ServiceCategory";
import { ServiceComponentProps } from "@/types";
import ServiceCard from "./ServiceCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
};

const Services = ({ services, categories }: ServiceComponentProps) => {
  const t = useTranslations("services");
  const locale = useLocale();

  // Get default category based on locale
  const getDefaultCategory = () => {
    return locale === "it"
      ? "Sviluppo di applicazioni"
      : "Application Development";
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(
    getDefaultCategory()
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update selected category when locale changes
  useEffect(() => {
    const getDefaultCategory = () => {
      return locale === "it"
        ? "Sviluppo di applicazioni"
        : "Application Development";
    };

    const defaultCategory = getDefaultCategory();
    // Only update if the current category matches the old default
    if (
      (locale === "en" && selectedCategory === "Sviluppo di applicazioni") ||
      (locale === "it" && selectedCategory === "Application Development")
    ) {
      setSelectedCategory(defaultCategory);
    }
  }, [locale, selectedCategory]);

  // console.log("Services data:", services);
  // console.log("Categories data:", categories);

  const handleSelectedCategory = (category: string) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setSelectedCategory(category);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    });
  };

  // Filter services based on category
  const filteredServices = services.filter((service) => {
    // If no category is selected, show all services
    if (!selectedCategory) {
      return true;
    }

    const categoryTitle = service.category?.title;
    const matches = categoryTitle === selectedCategory;
    return matches;
  });

  return (
    <section
      className="max-container padding-x padding-y min-h-screen"
      id="services"
    >
      <div className="flex flex-col justify-center padding-y">
        <h1 className="text-primary-white text-xl font-bold">{t("title")}</h1>
        <h5 className="text-primary-white text-4xl">{t("subtitle")}</h5>
        <div className="service__category-carousel">
          {categories?.map((item) => (
            <div key={item.id}>
              {item.title ? (
                <ServiceCategory
                  key={item.id}
                  category={item.title}
                  isActive={selectedCategory === item.title}
                  onClick={() => handleSelectedCategory(item.title)}
                />
              ) : (
                <p>Error: Title not available</p>
              )}
            </div>
          ))}
        </div>
        <div
          className={`service__carousel ${
            isTransitioning ? "transitioning" : ""
          }`}
        >
          <Swiper
            setWrapperSize={true}
            spaceBetween={30}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 40 },
              880: { slidesPerView: 2, spaceBetween: 40 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
              1366: { slidesPerView: 4, spaceBetween: 30 },
            }}
            height={500}
          >
            <AnimatePresence mode="wait">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <SwiperSlide key={service.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      key={service.id}
                    >
                      <ServiceCard
                        title={service.title || t("noTitle")}
                        description={service.description || t("noDescription")}
                      />
                    </motion.div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center h-64"
                  >
                    <p className="text-primary-white text-lg">
                      {t("noServices")}
                    </p>
                  </motion.div>
                </SwiperSlide>
              )}
            </AnimatePresence>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Services;
