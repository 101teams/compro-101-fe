import { ServiceCategoryContextData } from "@/types";
import React, { createContext, useState } from "react";


export const ServiceCategoryContext = createContext<ServiceCategoryContextData>(
  {
    activeCategory: null,
    setActiveCategory: () => {},
  }
);

export const ServiceCategoryProvider: React.FC = ({ children }: any) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <ServiceCategoryContext.Provider
      value={{ activeCategory, setActiveCategory }}
    >
      {children}
    </ServiceCategoryContext.Provider>
  );
};
