"use client";
import React, { useState } from "react";
import WorkCategory from "./WorkCategory";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { BASE_API } from "@/constant/endpoint";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Navigation, Pagination } from "swiper/modules";
import { WorkDisplayComponentProps } from "@/types";

const WorkDisplay = ({ categories, works }: WorkDisplayComponentProps) => {
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

  const filteredWorks = works.filter(
    (work) =>
      work.attributes.category.data.attributes.title === selectedCategory
  );

  return (
    <section className="max-container padding-x padding-y" id="work">
      <div className="display__container">
        <div className="flex flex-col gap-3">
          <h1 className="text-primary-white text-6xl font-bold">Works</h1>
          <p className="text-primary-white text-lg mb-5">
            Each client is unique and so is each project. While we have
            delivered many projects, however, we need to honour <br /> the
            confidentiality of our cliens. Here is a quick glimpseof our
            portofolio.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="display__category-container">
            {categories.map((category) => (
              <div className="" key={category.id}>
                <WorkCategory
                  category={category.attributes.title}
                  onClick={() =>
                    handleSelectedCategory(category.attributes.title)
                  }
                  isActive={selectedCategory === category.attributes.title}
                />
              </div>
            ))}
          </div>
          <hr className="bg-secondary-gray opacity-40 mt-4" />
          <div className="display__work-container">
            <div
              className={`service__carousel ${
                isTransitioning ? "transitioning" : ""
              }`}
            >
              {filteredWorks.map((work, index) => (
                <>
                  <div className="display__work-cards" key={work.id}>
                    <div className="flex justify-between w-full mb-10 lg:flex-row flex-col gap-5">
                      <h1 className="text-primary-white text-4xl font-semibold ">
                        {work.attributes.title}
                      </h1>
                      <div className="flex gap-4">
                        <p className="text-secondary-gray font-semibold text-lg self-end">
                          {work.attributes.category.data.attributes.title}
                        </p>
                        <p className="text-primary-white max-w-[280px] self-end text-right lg:text-left">
                          {work.attributes.summary}
                        </p>
                      </div>
                    </div>
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={30}
                      loop={true}
                      pagination={{
                        clickable: true,
                      }}
                      navigation={true}
                      modules={[Pagination, Navigation]}
                      className="mySwiper"
                    >
                      {work.attributes.image.data.map(
                        (
                          image: {
                            id: React.Key | null | undefined;
                            attributes: { url: string | StaticImport };
                          },
                          imageIndex: any
                        ) => (
                          <SwiperSlide key={image.id}>
                            <div className="flex justify-center">
                              <Image
                                src={`${image.attributes.url}`}
                                alt={`workimg-${imageIndex}`}
                                width={400}
                                height={400}
                                className="lg:w-[800px] lg:h-[440px] object-fit rounded-xl mb-10"
                              />
                            </div>
                          </SwiperSlide>
                        )
                      )}
                    </Swiper>
                    <p className="text-primary-white text-lg font-regular my-4 text-center justify-center">
                      {work.attributes.description}
                    </p>
                    <hr className="bg-secondary-gray opacity-40 my-10" />
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkDisplay;
