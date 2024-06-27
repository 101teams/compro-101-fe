import { ServiceProps } from "@/types";
import React from "react";

const ServiceCategory = ({
  category,
  onClick,
  isActive,
}: ServiceProps & {
  onClick: (category: string) => void;
  isActive: boolean;
}) => {
  return (
    <button
      className={`service__category_btn ${isActive ? "active" : ""}`}
      style={{
        border: isActive ? "1px solid #9b9b9b" : "1px solid transparent",
        outline: "none",
      
      }}
      onClick={() => onClick(category)}
    >
      {category}
    </button>
  );
};

export default ServiceCategory;
