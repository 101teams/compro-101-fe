"use client";
import { useEffect, useRef, useState } from "react";
import ServiceCategory from "./ServiceCategory";
import { ServiceComponentProps } from "@/types";
import ServiceCard from "./ServiceCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const Services = ({ services, categories }: ServiceComponentProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("App Development");

  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
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
        <div className="flex flex-col ml-4 lg:ml-0">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
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
                spaceBetween: 10,
              },
              "1366": {
                slidesPerView: 4,
                slidesPerGroup: 20,
              },
            }}
            className="service__carousel"
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
