"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveLeft, MoveRight } from "lucide-react";
import { WorksDataProps } from "@/types";
import ENDPOINT, { BASE_API } from "@/constant/endpoint";

interface WorkProps {
  work: WorksDataProps[];
}

const Work = ({ work }: WorkProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const element = document.getElementById("work");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToPreviousWork = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  const goToNextWork = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === work.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  const isLastIndex = activeIndex === work.length - 1;
  const isFirstIndex = activeIndex === 0;

  return (
    <div className="flex flex-col justify-between lg:flex-row">
      <div className="flex flex-col justify-between lg:w-1/2 pr-4 pt-10">
        <h1 className="font-bold text-[40px] text-primary-white lg:pt-10 min-h-[120px]">
          {work[activeIndex].attributes.title}
        </h1>
        <p className="text-primary-white lg:text-2xl min-h-[280px] max-h-[280px]">
          {work[activeIndex].attributes.description}
        </p>
        <button className="featured__more_btn" onClick={handleScroll}>
          <MoveRight />
          LEARN MORE
        </button>
      </div>
      <div className="flex flex-col">
        <div className="flex gap-5 my-5 self-end">
          <button
            className={`featured__slider_btn ${
              isFirstIndex ? "blur-[2px] cursor-not-allowed" : ""
            }`}
            onClick={goToPreviousWork}
          >
            <MoveLeft size={36} color="#DDDDDD" />
          </button>
          <button
            className={`featured__slider_btn ${
              isLastIndex ? "blur-[2px] cursor-not-allowed" : ""
            }`}
            onClick={goToNextWork}
            disabled={isLastIndex}
          >
            <MoveRight size={36} color="#DDDDDD" />
          </button>
        </div>

        <div className="relative h-[440px] w-[800px] lg:min-h-[440px] lg:min-w-[800px] lg:max-h-[440px] lg:max-w-[800px] ml-6">
          {work[activeIndex].attributes.image.data.map((item, index) => (
            <Image
              key={item.id}
              src={`${item.attributes.url}`}
              alt={`workimage-${index}`}
              width={600}
              height={440}
              className="absolute top-0 left-0 h-[240px] w-[400px] lg:min-h-[440px] lg:min-w-[800px] lg:max-h-[440px] lg:max-w-[800px] rounded-3xl"
              style={{ zIndex: index }}
              objectFit="fill"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
