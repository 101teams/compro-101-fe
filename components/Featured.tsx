import React from "react";
import Work from "./Work";
import { WorksDataProps } from "@/types";

const Featured = ({ works }: { works: WorksDataProps[] }) => {
  const featuredWork = works;

  return (
    <div className="min-h-screen relative z-0 no-scrollbar" id="featured">
      <div className="featured__background">
        <div className="featured__container padding-y z-10">
          <h1 className="text-secondary-yellow lg:text-[60px] text-base">
            OUR FEATURED WORKS
          </h1>
          <div className="flex flex-col justify-between">
            <Work work={featuredWork} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
