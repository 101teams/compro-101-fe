"use client";
import Image from "next/image";
import React from "react";

const Hero = () => {
  const handleScrollToServices = () => {
    const servicesElement = document.getElementById("services");
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="max-container flex xl:flex-row flex-col lg:justify-between sm:gap-0 md:gap-10 lg:gap-16 xl:gap-64 padding-x padding-y min-h-screen sm transition-all ease-in delay-150"
    >
      <h1 className="text-6xl lg:text-[120px] leading-tight text-primary-white font-semibold uppercase">
        One <br /> Think <br />
        Solution.
      </h1>
      <div className="flex flex-col lg:mt-14 mt-0">
        <p className="text-justify text-primary-white text-xl mt-5 sm:">
          Your partners in crafting unforgettable digital experiences that
          captivate, engage, and inspire. With a passion for innovation and a
          commitment to excellence, we specialize in creating immersive digital
          solutions that leave a lasting impact and help you achieve your goals.
        </p>
        <button className="hero__button" onClick={handleScrollToServices}>
          EXPLORE MORE
          <Image
            src="/arrow_left.svg"
            alt="arrow"
            width={20}
            height={20}
          ></Image>
        </button>
      </div>
    </section>
  );
};

export default Hero;
