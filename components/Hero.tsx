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
      className="max-container flex xl:flex-row flex-col lg:justify-center sm:gap-0 md:gap-10 lg:gap-16 xl:gap-64 padding-x padding-y min-h-screen sm transition-all ease-in delay-150 item-center relative"
    >
      <h1 className="text-6xl lg:text-[120px] leading-tight text-primary-white font-semibold uppercase self-center">
        One <br /> Think <br />
        Solution.
      </h1>
      <div className="flex flex-col lg:mt-14 mt-0 self-center">
        <p className="text-justify text-primary-white text-xl mt-5 sm:">
          Your partners in crafting unforgettable digital experiences that
          captivate, engage, and inspire. With a passion for innovation and a
          commitment to excellence, we specialize in creating immersive digital
          solutions that leave a lasting impact and help you achieve your goals.
        </p>
        <button className="hero__button" onClick={handleScrollToServices}>
          EXPLORE MORE
          <div className="">
            <svg
              width="19"
              height="16"
              viewBox="0 0 19 16"
              xmlns="http://www.w3.org/2000/svg"
              className="arrow-icon"
            >
              <path
                d="M18.2071 8.70711C18.5976 8.31658 18.5976 7.68342 18.2071 7.29289L11.8431 0.928932C11.4526 0.538408 10.8195 0.538408 10.4289 0.928932C10.0384 1.31946 10.0384 1.95262 10.4289 2.34315L16.0858 8L10.4289 13.6569C10.0384 14.0474 10.0384 14.6805 10.4289 15.0711C10.8195 15.4616 11.4526 15.4616 11.8431 15.0711L18.2071 8.70711ZM0.5 9H17.5V7H0.5V9Z"
                fill="#FCD32E"
              />
            </svg>
          </div>
        </button>
      </div>
      <div className="flex flex-col items-center bottom-0 left-0 w-full gap-3 absolute">
        <p className="text-lg uppercase text-secondary-gray text-center font-light ">
          Scroll <br /> to Explore
        </p>
        <div className="container relative">
          <div className="square"></div>
          <div className="square"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
