import { getTranslations } from "next-intl/server";
import Image from "next/image";

const weapons = [
  { key: "longsword", image: "/images/weapons/longsword.png" },
  { key: "saber", image: "/images/weapons/saber.png" },
  { key: "rapier", image: "/images/weapons/rapier.png" },
] as const;

export default async function WeaponsPanel() {
  const t = await getTranslations("Hero");
  const tNav = await getTranslations("Nav");

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-off-white/30 bg-black/20 py-4 px-4 backdrop-blur-md">
      <div className="flex divide-x divide-off-white/20">
        {weapons.map((weapon) => (
          <div
            key={weapon.key}
            className="flex w-60 flex-col align-center gap-2 px-2 first:pl-0 last:pr-0"
          >
            <div className="relative h-20 w-full">
              <Image
                src={weapon.image}
                alt={t(`weapons.${weapon.key}`)}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-center font-serif text-3xl leading-8 font-light tracking-tight text-paper-100">
              {t(`weapons.${weapon.key}`)}
            </span>
          </div>
        ))}
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
