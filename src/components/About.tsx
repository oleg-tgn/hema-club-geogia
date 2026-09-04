import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function About() {
  const tAbout = await getTranslations("About");

  return (
    <div className="w-full py-16">
      <div className="grid gap-8 [grid-template-areas:'left'_'content'_'right'] md:grid-cols-[1fr_minmax(0,32rem)_1fr] md:[grid-template-areas:'left_content_right']">
        <div className="[grid-area:left] flex gap-4 md:flex-col">
          <div className="relative aspect-square flex-1 md:aspect-auto">
            <Image
              src="/images/about-1.svg"
              alt=""
              aria-hidden
              fill
              className="object-contain"
            />
          </div>
          <div className="relative aspect-square flex-1 md:aspect-auto">
            <Image
              src="/images/about-2.svg"
              alt=""
              aria-hidden
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="[grid-area:content] text-center">
          <h2 className="text-3xl font-bold mb-4">{tAbout("title")}</h2>
          <p className="text-lg">{tAbout("text")}</p>
        </div>

        <div className="[grid-area:right] flex gap-4 md:flex-col">
          <div className="relative aspect-square flex-1 md:aspect-auto">
            <Image
              src="/images/about-3.svg"
              alt=""
              aria-hidden
              fill
              className="object-contain"
            />
          </div>
          <div className="relative aspect-square flex-1 md:aspect-auto">
            <Image
              src="/images/about-4.svg"
              alt=""
              aria-hidden
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
