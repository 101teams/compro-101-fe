import { getTranslations } from "next-intl/server";

export default async function WorkNotFound() {
  const tr = await getTranslations("works");

  return (
    <section className="max-container padding-x py-12 md:py-16 lg:py-24">
      <div className="mx-auto text-center">
        <h1 className="text-primary-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
          {tr("notFound.title")}
        </h1>
        <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto">
          {tr("notFound.description")}
        </p>
      </div>
    </section>
  );
}
