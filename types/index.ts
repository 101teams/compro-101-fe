import { MouseEventHandler } from "react";

export interface ServiceProps {
  title?: string;
  summary?: string;
  category: string;
  categoryDisplay?: string;
  link?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isActive: boolean;
}

export interface WrokCategoryProps {
  isActive: boolean;
  category: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export interface ServiceCardProps {
  title: string;
  description?: string;
}

export interface WorkProps {
  title: string;
  description: string;
  imageUrl: string;
}

export interface CategoryDataProps {
  id: number;
  attributes: {
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface ServiceDataProps {
  id: number;
  attributes: {
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    description?: string;
    category?: {
      data: CategoryDataProps;
    };
  };
}

export interface ServiceComponentProps {
  services: ServiceDataProps[];
  categories: CategoryDataProps[];
}

export interface WorksImageProps {
  map(
    arg0: (
      image: {
        id: import("react").Key | null | undefined;
        attributes: {
          url:
            | string
            | import("next/dist/shared/lib/get-img-props").StaticImport;
        };
      },
      imageIndex: any
    ) => import("react").JSX.Element
  ): import("react").ReactNode;
  id: number;
  attributes: {
    name: string;
    url: string;
  }[];
}

export interface WorksDataProps {
  id: number;
  attributes: {
    summary: string;
    category: any;
    title: string;
    description: string;
    image: {
      data: WorksImageProps;
    };
  };
}

export interface WorkComponentProps {
  work: WorksDataProps;
}

export interface WorkDisplayComponentProps {
  categories: CategoryDataProps[];
  works: WorksDataProps[];
}
export interface ServiceCategoryContextData {
  activeCategory: string | null;
  setActiveCategory: (category: string) => void;
}
