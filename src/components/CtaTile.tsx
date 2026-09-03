import { getLocale } from "next-intl/server";
import ArrowIcon from "./ArrowIcon";

type CtaTileProps = {
  href: string;
  children: React.ReactNode;
  size: "lg" | "sm";
  external?: boolean;
  grow?: number;
};

// ru/ka translations run longer than en, so those locales get the next
// size down to keep the label from overflowing the tile.
const textSizeClasses: Record<
  CtaTileProps["size"],
  Record<"default" | "compact", string>
> = {
  lg: {
    default: "text-4xl leading-none font-normal",
    compact: "text-2xl leading-none font-normal",
  },
  sm: {
    default: "text-xl leading-none font-medium",
    compact: "text-base leading-none font-medium",
  },
};

export default async function CtaTile({
  href,
  children,
  size,
  external = false,
  grow = 1,
}: CtaTileProps) {
  const locale = await getLocale();
  const sizeClass =
    textSizeClasses[size][locale === "en" ? "default" : "compact"];

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ flex: `${grow} 0 0` }}
      className="group @container flex h-full flex-col items-end justify-between overflow-hidden rounded-lg border border-gold-200 text-gold-200 transition-colors hover:border-gold-100 hover:text-gold-100"
    >
      <span className="mt-1 mr-1">
        <ArrowIcon
          external={external}
          className="text-gold-200 group-hover:text-gold-100"
        />
      </span>
      <span
        className={`w-max mb-3 px-2.5 self-start lining-nums proportional-nums transition-transform duration-300 group-hover:translate-x-[calc(100cqw-100%)] ${sizeClass}`}
      >
        {children}
      </span>
    </a>
  );
}
