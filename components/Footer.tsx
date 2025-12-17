"use client";
import { footerLinks, sitemapsLinks } from "@/constant";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLocale, useTranslations } from "next-intl";

const Footer = () => {
  const tr = useTranslations("footer");
  const locale = useLocale();
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
            <h1 className="text-primary-white text-4xl">{tr("title")}</h1>
            <h2 className="text-primary-white text-4xl font-bold">
              info@101team.it
            </h2>
          </div>
          <hr className="bg-secondary-gray opacity-40 mt-20" />
          <div className="flex flex-row gap-20 ">
            <div className="flex flex-col mt-20">
              <h1 className="lg:text-3xl text-primary-white font-semibold">
                {tr("sitemaps")}
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
                {tr("socials")}
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
          <div className="self-end flex flex-col items-end gap-1 lg:-mt-20 ml-20 text-xs lg:text-sm text-primary-white">
            <p>{tr("copyright")}</p>
            <Link
              href={`/${locale}/cookies`}
              className="text-[11px] underline underline-offset-2 opacity-80 hover:opacity-100"
            >
              {tr("cookiesLink")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
