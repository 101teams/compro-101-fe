import React from "react";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";
import { BASE_API } from "@/constant/endpoint";

interface BlocksRendererProps {
  content: BlocksContent;
}

interface ImageBlock {
  type: "image";
  image: {
    url: string;
    alternativeText?: string;
    caption?: string;
  };
}

export const BlocksRenderer: React.FC<BlocksRendererProps> = ({ content }) => {
  if (!content) return null;

  const renderText = (
    text: string,
    bold?: boolean,
    italic?: boolean,
    underline?: boolean,
    key?: number
  ) => {
    let content: React.ReactNode = text;
    if (bold) content = <strong key={key}>{content}</strong>;
    if (italic) content = <em key={key}>{content}</em>;
    if (underline) content = <u key={key}>{content}</u>;
    return content;
  };

  const getImageUrl = (url: string) => {
    // If the URL already starts with http or https, return it as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Otherwise, prepend the BASE_API
    return `${BASE_API}${url}`;
  };

  return (
    <div className="blocks-content">
      {content.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={index} className="mb-4">
                {block.children.map((child, childIndex) => {
                  if (child.type === "text") {
                    return renderText(
                      child.text,
                      child.bold,
                      child.italic,
                      child.underline,
                      childIndex
                    );
                  }
                  return null;
                })}
              </p>
            );
          case "heading":
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag
                key={index}
                className={`mb-4 ${
                  block.level === 1
                    ? "text-3xl"
                    : block.level === 2
                    ? "text-2xl"
                    : "text-xl"
                }`}
              >
                {block.children.map((child, childIndex) => {
                  if (child.type === "text") {
                    return renderText(
                      child.text,
                      child.bold,
                      child.italic,
                      child.underline,
                      childIndex
                    );
                  }
                  return null;
                })}
              </HeadingTag>
            );
          case "list":
            const ListTag = block.format === "ordered" ? "ol" : "ul";
            return (
              <ListTag key={index} className="mb-4 list-disc pl-6">
                {block.children.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.children.map((child, childIndex) => {
                      if (child.type === "text") {
                        return renderText(
                          child.text,
                          child.bold,
                          child.italic,
                          child.underline,
                          childIndex
                        );
                      }
                      return null;
                    })}
                  </li>
                ))}
              </ListTag>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-4 border-blue-500 pl-4 italic mb-4"
              >
                {block.children.map((child, childIndex) => {
                  if (child.type === "text") {
                    return renderText(
                      child.text,
                      child.bold,
                      child.italic,
                      child.underline,
                      childIndex
                    );
                  }
                  return null;
                })}
              </blockquote>
            );
          case "code":
            return (
              <pre
                key={index}
                className="bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto"
              >
                <code>
                  {block.children.map((child, childIndex) => {
                    if (child.type === "text") {
                      return <span key={childIndex}>{child.text}</span>;
                    }
                    return null;
                  })}
                </code>
              </pre>
            );
          case "image":
            const imageBlock = block as unknown as ImageBlock;
            if (!imageBlock.image?.url) return null;

            return (
              <div key={index} className="my-8">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={getImageUrl(imageBlock.image.url)}
                    alt={imageBlock.image.alternativeText || "Article image"}
                    fill
                    className="object-fitp"
                  />
                </div>
                {imageBlock.image.caption && (
                  <p className="mt-2 text-sm text-gray-400 text-center">
                    {imageBlock.image.caption}
                  </p>
                )}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
