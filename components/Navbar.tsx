"use client";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/constant";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isTop, setIsTop] = useState(true);
  const [nav, setNav] = useState(false);
  const handleNav = () => {
    setNav(!nav);
  };

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsTop(scrollTop === 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`padding-x py-5 sticky top-0 z-20 w-full ${
        isTop ? "bg-transparent" : "bg-[#0A1623]"
      } border-none transition-all duration-300`}
    >
      <nav className="flex justify-between items-center max-container 2xl:padding-x">
        <button
          onClick={() => handleScroll("home")}
          className="flex justify-center items-center"
        >
          <Image src="/logo.svg" width={30} height={30} alt="logo" />
          <p className="text-2xl text-primary-white ml-3">101 Team</p>
        </button>
        <ul className="flex justify-between items-center gap-5 text-primary-white text-md max-lg:hidden">
          <button onClick={() => handleScroll("work")} className="nav__links">
            Work
          </button>
          <button
            onClick={() => handleScroll("services")}
            className="nav__links"
          >
            Services
          </button>
          <button onClick={() => handleScroll("footer")} className="nav__links">
            Contact
          </button>
        </ul>
        <div onClick={handleNav} className="block sm:hidden z-10">
          {nav ? <X color="#ababab" /> : <Menu color="#ababab" />}
        </div>
        <div
          className={
            nav
              ? "sm:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-white text-center ease-in duration-300"
              : "sm:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-white text-center ease-in duration-300"
          }
        >
          <ul>
            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <button onClick={() => handleScroll("home")}>Home</button>
            </li>
            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <button onClick={() => handleScroll("work")}>Works</button>
            </li>
            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <button onClick={() => handleScroll("footer")}>Contact</button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
