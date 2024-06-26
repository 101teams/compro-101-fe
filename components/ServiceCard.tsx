"use client";
import { ServiceCardProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ServiceCard = ({ title, description }: ServiceCardProps) => {
  const handleScroll = () => {
    const element = document.getElementById("work");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`service__card-container`}>
      <Image
        src="/card_icon.svg"
        alt="cardlogo"
        width={32}
        height={32}
        className="self-end bg-transparent"
      />
      <h1 className="text-2xl font-semibold text-primary-white bg-transparent">
        {title}
      </h1>
      <p className="text-base text-primary-white opacity-80 bg-transparent">
        {description}
      </p>
      <div className="flex gap-2 bg-transparent mt-auto">
        <button className="flex gap-2 items-center" onClick={handleScroll}>
          <p className="bg-transparent text-sx text-primary-white opacity-60 cursor-pointer">
            LEARN MORE
          </p>
          <Image
            src="/arrow_2.svg"
            alt="arrow"
            width={16}
            height={3}
            className="bg-transparent"
          />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
