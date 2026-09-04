import config from "@payload-config";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import { getPayload } from "payload";

type AboutJoin = {
  title?: string | null;
  text?: string | null;
  buttonLabel?: string | null;
};

type AboutGlobal = {
  title: string;
  text: string;
  join?: AboutJoin | null;
};

function JoinTeaser({ join }: { join: AboutJoin }) {
  return (
    <a
      href="#join"
      className="group mt-8 flex w-full items-stretch gap-2 rounded-lg border border-black/20 p-4 text-night text-left"
    >
      <div className="flex flex-1 flex-col gap-2">
        {join.title && (
          <h3 className="relative z-10 origin-left font-serif text-3xl leading-8 font-normal uppercase tracking-tight transition-transform duration-300">
            {join.title}
          </h3>
        )}
        {join.text && <p className="text-sm leading-5 ">{join.text}</p>}
        {join.buttonLabel && (
          <span className="text-base leading-6 font-semibold">
            {join.buttonLabel}
          </span>
        )}
      </div>
      <div className="relative w-48 shrink-0">
        <Image
          src="/images/About-join.svg"
          alt=""
          aria-hidden
          fill
          className="object-contain"
        />
      </div>
    </a>
  );
}

export default async function About() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const about = (await payload.findGlobal({
    slug: "about",
    locale: locale as "en" | "ka" | "ru",
  })) as AboutGlobal;

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
          <h2 className="text-3xl font-bold mb-4">{about.title}</h2>
          <p className="text-lg">{about.text}</p>

          {about.join?.text && <JoinTeaser join={about.join} />}
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
