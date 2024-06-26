"use client";
import { useEffect, useRef, useState } from "react";
import ServiceCategory from "./ServiceCategory";
import { ServiceComponentProps } from "@/types";
import ServiceCard from "./ServiceCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import "swiper/css/pagination";

const Services = ({ services, categories }: ServiceComponentProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("App Development");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelectedCategory = (category: string) => {
    setIsTransitioning(true);

    setTimeout(() => {
      setSelectedCategory(category);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section
      className="max-container padding-x padding-y min-h-screen"
      id="services"
    >
      <div className="flex flex-col justify-center padding-y">
        <h1 className="text-primary-white text-xl font-bold">SERVICES</h1>
        <h5 className="text-primary-white text-4xl">See how we can help you</h5>
        <div className="service__category-carousel">
          {categories.map((item) => (
            <div key={item.id}>
              {item.attributes ? (
                <ServiceCategory
                  key={item.id}
                  category={item.attributes.title}
                  isActive={selectedCategory === item.attributes.title}
                  onClick={() => handleSelectedCategory(item.attributes.title)}
                />
              ) : (
                <p>Error: Attributes not available</p>
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
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
              880: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1366: {
                slidesPerView: 4,
                slidesPerGroup: 30,
              },
            }}
            height={500}
          >
            {services
              .filter(
                (service) =>
                  !selectedCategory ||
                  service.attributes.category?.data.attributes.title ===
                    selectedCategory
              )
              .map((service) => (
                <SwiperSlide key={service.id}>
                  <ServiceCard
                    title={service.attributes.title}
                    description={service.attributes.description}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Services;