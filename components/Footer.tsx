"use client";
import { footerLinks, sitemapsLinks } from "@/constant";
import { Cpu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Footer = () => {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <hr className="bg-secondary-gray opacity-40" />

      <section
        className="flex flex-col justify-between min-h-screen max-container padding-x padding-y bg-none"
        id="footer"
      >
        <div className="flex flex-col">
          <div className="flex justify-between flex-col lg:flex-row gap-5 text-center">
            <h1 className="text-primary-white text-4xl">Work with us</h1>
            <h2 className="text-primary-white text-4xl font-bold">
              info@101-team.it
            </h2>
          </div>
          <hr className="bg-secondary-gray opacity-40 mt-20" />
          <div className="flex flex-row gap-20 ">
            <div className="flex flex-col mt-20">
              <h1 className="lg:text-3xl text-primary-white font-semibold">
                Sitemaps
              </h1>
              {sitemapsLinks.map((link) => (
                <button
                  key={link.title}
                  className="self-start text-primary-white lg:text-2xl mt-2 hover:scale-up-and-color"
                  onClick={() => handleScroll(link.id)}
                >
                  {link.title}
                </button>
              ))}
            </div>
            <div className="flex flex-col mt-20">
              <h1 className="lg:text-3xl text-primary-white font-semibold">
                Socials
              </h1>
              {footerLinks.map((link) => (
                <Link
                  href="/"
                  key={link.title}
                  className="self-start text-primary-white lg:text-2xl mt-2 hover:scale-up-and-color"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-40 flex justify-between items-end">
          <div className="flex flex-row items-center lg:gap-10 gap-3">
            <Image
              src="/logo_white.svg"
              alt="logo"
              width={180}
              height={180}
              className="self-end max-sm:w-[60px]"
            />
            <h1 className="text-primary-white lg:text-[100px] font-black">
              101 DEV TEAM
            </h1>
          </div>
          <p className="self-end text-primary-white lg:-mt-20 ml-20 text-xs lg:text-base">
            Copyright © 2025 101 Development Team
          </p>
        </div>
      </section>
    </>
  );
};

export default Footer;
