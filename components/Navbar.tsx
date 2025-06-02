"use client";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/constant";
import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

const Navbar = () => {
  const tr = useTranslations("navbar");
  const locale = useLocale();
  const [isTop, setIsTop] = useState(true);
  const [nav, setNav] = useState(false);
  const [showLocaleMenu, setShowLocaleMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Fix: Check for work detail page correctly with locale
  const isWorkDetailPage = pathname?.includes("/work/");

  const handleNav = () => {
    setNav(!nav);
  };

  const handleScroll = (id: string) => {
    if (isWorkDetailPage) {
      // Fix: Navigate to home page with locale, then handle scroll
      router.push(`/${locale}/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLocaleChange = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${currentPath}`);
    setShowLocaleMenu(false);
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      const scrollTop = window.pageYOffset;
      setIsTop(scrollTop === 0);
    };

    window.addEventListener("scroll", handleScrollEvent);

    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  // Close locale menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".locale-menu")) {
        setShowLocaleMenu(false);
      }
    };

    if (showLocaleMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showLocaleMenu]);

  return (
    <header
      className={`padding-x py-5 sticky top-0 z-20 w-full ${
        isTop ? "bg-transparent" : "bg-[#0A1623]/95 backdrop-blur-sm"
      } border-none transition-all duration-300`}
    >
      <nav className="flex justify-between items-center max-container 2xl:padding-x">
        {isWorkDetailPage ? (
          <Link
            href={`/${locale}`}
            className="flex justify-center items-center"
          >
            <Image src="/logo.svg" width={30} height={30} alt="logo" />
            <p className="text-2xl text-primary-white ml-3">101 Team</p>
          </Link>
        ) : (
          <button
            onClick={() => handleScroll("home")}
            className="flex justify-center items-center"
          >
            <Image src="/logo.svg" width={30} height={30} alt="logo" />
            <p className="text-2xl text-primary-white ml-3">101 Team</p>
          </button>
        )}

        <div className="flex items-center gap-5">
          <ul className="flex justify-between items-center gap-5 text-primary-white text-md max-lg:hidden">
            <button onClick={() => handleScroll("work")} className="nav__links">
              {tr("works")}
            </button>
            <button
              onClick={() => handleScroll("services")}
              className="nav__links"
            >
              {tr("services")}
            </button>
            <button
              onClick={() => handleScroll("footer")}
              className="nav__links"
            >
              {tr("contact")}
            </button>
          </ul>

          {/* Locale Toggle Button */}
          <div className="relative locale-menu max-lg:hidden">
            <button
              onClick={() => setShowLocaleMenu(!showLocaleMenu)}
              className="flex items-center gap-2 text-primary-white hover:text-gray-300 transition-colors duration-200 p-2 rounded-md hover:bg-white/10"
            >
              <Globe size={18} />
              <span className="text-sm font-medium uppercase">{locale}</span>
            </button>

            {showLocaleMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border overflow-hidden min-w-[120px]">
                <button
                  onClick={() => handleLocaleChange("en")}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                    locale === "en"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => handleLocaleChange("it")}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                    locale === "it"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  🇮🇹 Italiano
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div onClick={handleNav} className="block lg:hidden z-10">
          {nav ? <X color="#ababab" /> : <Menu color="#ababab" />}
        </div>

        {/* Mobile Menu */}
        <div
          className={
            nav
              ? "lg:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-white text-center ease-in duration-300"
              : "lg:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-white text-center ease-in duration-300"
          }
        >
          <ul>
            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <button onClick={() => handleScroll("home")}></button>
            </li>
            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <button onClick={() => handleScroll("work")}>
                {tr("works")}
              </button>
            </li>
            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <button onClick={() => handleScroll("services")}>
                {tr("services")}
              </button>
            </li>
            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <button onClick={() => handleScroll("footer")}>
                {tr("contact")}
              </button>
            </li>

            {/* Mobile Locale Toggle */}
            <li className="p-4">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    handleLocaleChange("en");
                    handleNav();
                  }}
                  className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
                    locale === "en"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  🇺🇸 EN
                </button>
                <button
                  onClick={() => {
                    handleLocaleChange("it");
                    handleNav();
                  }}
                  className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
                    locale === "it"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  🇮🇹 IT
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
