import { getTranslations } from "next-intl/server";
import Image from "next/image";

const weapons = [
  { key: "longsword", image: "/images/weapons/longsword.png" },
  { key: "saber", image: "/images/weapons/saber.png" },
  { key: "rapier", image: "/images/weapons/rapier.png" },
] as const;

export default async function WeaponsPanel() {
  const t = await getTranslations("Hero.weapons");

  return (
    <div className="flex gap-2">
      {weapons.map((weapon) => (
        <div
          key={weapon.key}
          className="flex w-60 flex-col align-center gap-2 self-stretch rounded-lg border border-off-white/30 bg-black/20 py-4 px-4 backdrop-blur-md"
        >
          <div className="relative h-20 w-full">
            <Image
              src={weapon.image}
              alt={t(weapon.key)}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-center font-serif text-3xl leading-8 font-light tracking-tight text-paper-100">
            {t(weapon.key)}
          </span>
        </div>
      ))}
    </div>
  );
}
