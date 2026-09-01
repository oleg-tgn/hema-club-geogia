import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("AboutPage");

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
        <p className="text-lg max-w-2xl mx-auto">{t("intro")}</p>
      </div>
    </section>
  );
}
