"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MoveLeft, MoveRight } from "lucide-react";
import { WorksDataProps } from "@/types";
import { BASE_API } from "@/constant/endpoint";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface WorkProps {
  work: WorksDataProps[];
}

const Work = ({ work }: WorkProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const router = useRouter();

  // Guard clause for empty work array
  if (!work || work.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <p className="text-primary-white text-xl">No work items available</p>
      </div>
    );
  }

  // Safely get the current work item
  const currentWork = work[activeIndex];
  if (!currentWork) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <p className="text-primary-white text-xl">Invalid work item data</p>
      </div>
    );
  }

  // Safely construct image URL with null checks
  const imageData = currentWork.image?.[0];
  const imgUrl = imageData?.url ? `${BASE_API}${imageData.url}` : "";

  const goToPreviousWork = () => {
    if (activeIndex > 0) {
      setDirection(-1);
      setActiveIndex(activeIndex - 1);
    }
  };

  const goToNextWork = () => {
    if (activeIndex < work.length - 1) {
      setDirection(1);
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleLearnMore = () => {
    if (currentWork.slug) {
      router.push(`/work/${currentWork.slug}`);
    }
  };

  const isLastIndex = activeIndex === work.length - 1;
  const isFirstIndex = activeIndex === 0;

  // Animation variants
  const contentVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 600 : -600,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -600 : 600,
      opacity: 0,
    }),
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="flex flex-col justify-between lg:flex-row">
      <div className="flex flex-col justify-between lg:w-1/2 pr-4 pt-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col justify-between h-full"
          >
            <h1 className="font-bold text-[40px] text-primary-white lg:pt-10 min-h-[120px]">
              {currentWork.title || "Untitled Work"}
            </h1>
            <p className="text-primary-white lg:text-2xl min-h-[240px]">
              {currentWork.description || "No description available"}
            </p>
            <motion.button
              onClick={handleLearnMore}
              className="featured__more_btn"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <MoveLeft />
              LEARN MORE
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-col">
        <div className="flex self-end gap-5 my-5">
          <motion.button
            className={`featured__slider_btn ${
              isFirstIndex ? "blur-[2px] cursor-not-allowed" : ""
            }`}
            onClick={goToPreviousWork}
            disabled={isFirstIndex}
            variants={buttonVariants}
            whileHover={!isFirstIndex ? "hover" : undefined}
            whileTap={!isFirstIndex ? "tap" : undefined}
          >
            <MoveLeft size={36} color="#DDDDDD" />
          </motion.button>
          <motion.button
            className={`featured__slider_btn ${
              isLastIndex ? "blur-[2px] cursor-not-allowed" : ""
            }`}
            onClick={goToNextWork}
            disabled={isLastIndex}
            variants={buttonVariants}
            whileHover={!isLastIndex ? "hover" : undefined}
            whileTap={!isLastIndex ? "tap" : undefined}
          >
            <MoveRight size={36} color="#DDDDDD" />
          </motion.button>
        </div>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Image
              src={imgUrl}
              alt={currentWork.title || "Work image"}
              width={600}
              height={440}
              className="lg:min-h-[440px] lg:min-w-[600px] lg:max-h-[400px] lg:max-w-[600px] h-[260px] w-screen object-fill"
              objectFit="cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Work;
