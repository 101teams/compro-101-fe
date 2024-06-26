import { WrokCategoryProps } from "@/types";
import React from "react";

const WorkCategory = ({
  category,
  onClick,
  isActive,
}: WrokCategoryProps & {
  onClick: (category: string) => void;
  isActive: boolean;
}) => {
  return (
    <button
      className="display__category-btn"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
      onClick={() => onClick(category)}
    >
      <span
        className="after"
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          height: "3px",
          backgroundColor: "#FFD700",
          width: isActive ? "100%" : "0",
          transition: "width 0.3s ease-in",
        }}
      ></span>
      {category}
    </button>
  );
};
export default WorkCategory;
