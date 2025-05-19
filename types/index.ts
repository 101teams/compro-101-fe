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
  description: string;
}

export interface WorkProps {
  title: string;
  description: string;
  imageUrl: string;
}

export interface CategoryDataProps {
  id: number;
  documentId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  services: any[];
}

export interface ServiceDataProps {
  id: number;
  documentId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  category: {
    id: number;
    documentId: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface ServiceComponentProps {
  services: ServiceDataProps[];
  categories: CategoryDataProps[];
}

export interface WorksImageProps {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    small: ImageFormat;
    medium: ImageFormat;
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface WorksDataProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  summary: string;
  slug: string;
  image: Array<{
    id: number;
    url: string;
    formats: {
      small: { url: string };
      medium: { url: string };
      thumbnail: { url: string };
    };
  }>;
  service: {
    id: number;
    title: string;
  };
  category: {
    id: number;
    title: string;
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
  setActiveCategory: (category: string | null) => void;
}
