import { notFound } from "next/navigation";
import { BASE_API } from "@/constant/endpoint";
import WorkDetailClient, {
  WorkDetail,
  WorkItem,
} from "@/components/WorkDetailClient";

interface WorkDetailPageProps {
  params: { locale: string; slug: string };
}

async function fetchWorks(locale: string) {
  const res = await fetch(
    `${BASE_API}/api/works?locale=${locale}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data?.data ?? [];
}

export default async function WorkDetailPage({
  params: { locale, slug },
}: WorkDetailPageProps) {
  const allWorks = await fetchWorks(locale);

  if (!allWorks || allWorks.length === 0) {
    notFound();
  }

  const workData = allWorks.find((w: any) => w.slug === slug);

  if (!workData) {
    notFound();
  }

  const work: WorkDetail = {
    id: workData.id,
    title: workData.title,
    description: workData.description,
    summary:
      workData.summary || workData.description.substring(0, 200) + "...",
    slug: workData.slug,
    article:
      typeof workData.article === "string"
        ? JSON.parse(workData.article)
        : workData.article || [],
    image: (workData.image || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      mime: img.mime || "image/jpeg",
      name: img.name,
      ext: img.ext,
      alternativeText: img.alternativeText,
      caption: img.caption,
      formats: img.formats,
      size: img.size,
      width: img.width,
      height: img.height,
      previewUrl: img.previewUrl,
      provider: img.provider,
      provider_metadata: img.provider_metadata,
    })),
    service: workData.service
      ? {
          id: workData.service.id,
          title: workData.service.title,
        }
      : {
          id: 0,
          title: "Uncategorized",
        },
    category: workData.category
      ? {
          id: workData.category.id,
          title: workData.category.title,
        }
      : {
          id: 0,
          title: "Uncategorized",
        },
    createdAt: workData.createdAt,
    documentId: workData.documentId,
  };

  const related = allWorks.filter((item: any) => {
    if (!item.service || !item.category) return false;
    return (
      item.slug !== slug &&
      (item.category.id === workData.category?.id ||
        item.service.id === workData.service?.id)
    );
  });

  const transformedRelated: WorkItem[] = related.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    slug: item.slug,
    image: (item.image || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      mime: img.mime || "image/jpeg",
      name: img.name,
      ext: img.ext,
      alternativeText: img.alternativeText,
      caption: img.caption,
      formats: img.formats,
      size: img.size,
      width: img.width,
      height: img.height,
      previewUrl: img.previewUrl,
      provider: img.provider,
      provider_metadata: img.provider_metadata,
    })),
    service: {
      id: item.service?.id || 0,
      title: item.service?.title || "Uncategorized",
    },
    category: {
      id: item.category?.id || 0,
      title: item.category?.title || "Uncategorized",
    },
  }));

  const shuffledRelated = transformedRelated.sort(() => Math.random() - 0.5);
  const selectedRelated = shuffledRelated.slice(0, 3);

  if (selectedRelated.length < 3) {
    const randomWorks: WorkItem[] = allWorks
      .filter(
        (item: any) =>
          item.slug !== slug &&
          !selectedRelated.some((r: WorkItem) => r.id === item.id)
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 - selectedRelated.length)
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        slug: item.slug,
        image: (item.image || []).map((img: any) => ({
          id: img.id,
          url: img.url,
          mime: img.mime || "image/jpeg",
          name: img.name,
          ext: img.ext,
          alternativeText: img.alternativeText,
          caption: img.caption,
          formats: img.formats,
          size: img.size,
          width: img.width,
          height: img.height,
          previewUrl: img.previewUrl,
          provider: img.provider,
          provider_metadata: img.provider_metadata,
        })),
        service: {
          id: item.service?.id || 0,
          title: item.service?.title || "Uncategorized",
        },
        category: {
          id: item.category?.id || 0,
          title: item.category?.title || "Uncategorized",
        },
      }));

    selectedRelated.push(...randomWorks);
  }

  return (
    <WorkDetailClient
      work={work}
      relatedWorks={selectedRelated}
      locale={locale}
    />
  );
}

