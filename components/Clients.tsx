"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BASE_API } from "@/constant/endpoint";
import { ClientsLogoProps } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ClientsProps {
  clients: ClientsLogoProps[];
}

const Clients = ({ clients }: ClientsProps) => {
  const [visibleClients, setVisibleClients] = useState<
    (ClientsLogoProps | null)[]
  >(Array(8).fill(null));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentKeys, setCurrentKeys] = useState<string[]>(Array(8).fill(""));

  const shuffleClients = () => {
    const shuffled = [...clients].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  };

  useEffect(() => {
    if (!clients || clients.length === 0) return;
    const initialClients = shuffleClients();
    setVisibleClients(initialClients);
    setCurrentKeys(
      initialClients.map((client) => `${client.id}-${Date.now()}`)
    );

    const intervalId = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setVisibleClients(Array(8).fill(null));
        setTimeout(() => {
          const newClients = shuffleClients();
          setVisibleClients(newClients);
          setCurrentKeys(
            newClients.map((client) => `${client.id}-${Date.now()}`)
          );
          setIsTransitioning(false);
        }, 100);
      }, 400);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [clients]);

  if (!clients || clients.length === 0) {
    return null;
  }

  return (
    <section className="max-container padding-x py-12 md:py-16 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-primary-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Our Clients & Partners
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-3xl">
            We&apos;ve had the privilege of working with amazing companies and
            organizations. Here are some of our valued clients and partners.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="relative aspect-[3/2] bg-[#0C1E31]/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex items-center justify-center p-4 hover:border-white/20 transition-all duration-300"
            >
              <AnimatePresence mode="sync">
                {visibleClients[index] && !isTransitioning && (
                  <motion.div
                    key={currentKeys[index]}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        duration: 0.7,
                        ease: "easeInOut",
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: {
                        duration: 0.4,
                        ease: "easeOut",
                      },
                    }}
                    className="relative w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      type: "tween",
                      duration: 0.2,
                    }}
                  >
                    <Image
                      src={`${BASE_API}${visibleClients[index].logo.url}`}
                      alt={
                        visibleClients[index].logo.alternativeText ||
                        visibleClients[index].logo.name
                      }
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
