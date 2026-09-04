import config from "@payload-config";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { getPayload } from "payload";

type WeaponImage = {
  alt?: string | null;
  url?: string | null;
};

type WeaponDoc = {
  id: string;
  image?: WeaponImage | string | null;
  name: string;
};

export default async function WeaponsPanel() {
  const locale = await getLocale();
  const t = await getTranslations("Hero");
  const tNav = await getTranslations("Nav");
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "weapons",
    depth: 1,
    limit: 50,
    locale: locale as "en" | "ka" | "ru",
    sort: "order",
  });

  const weapons = docs as WeaponDoc[];

  if (weapons.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-off-white/30 bg-black/20 py-4 px-4 backdrop-blur-md">
      <div className="flex divide-x divide-off-white/20">
        {weapons.map((weapon) => {
          const image =
            weapon.image && typeof weapon.image === "object"
              ? weapon.image
              : null;

          return (
            <div
              key={weapon.id}
              className="flex w-60 flex-col align-center gap-2 px-2 first:pl-0 last:pr-0"
            >
              <div className="relative h-20 w-full">
                {image?.url && (
                  <Image
                    src={image.url}
                    alt={image.alt || weapon.name}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <span className="text-center font-serif text-3xl leading-8 font-light tracking-tight text-paper-100">
                {weapon.name}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-6 border-t border-off-white/20 pt-4">
        <a
          href="#instructors"
          className="text-base font-medium text-gold-200 transition-colors hover:text-gold-100"
        >
          {tNav("instructors")}
        </a>
        <a
          href="#schedule"
          className="text-base font-medium text-gold-200 transition-colors hover:text-gold-100"
        >
          {t("ctaSchedule")}
        </a>
      </div>
    </div>
  );
}
