import { Fragment } from "react";
import config from "@payload-config";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { getPayload } from "payload";
import Heading from "./Heading";

type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type Level = "beginners" | "advanced";

type TFunc = Awaited<ReturnType<typeof getTranslations>>;

type WeaponRef = {
  id: string;
  name: string;
  slug: string;
};

type ScheduleEntryDoc = {
  id: string;
  weapon?: WeaponRef | string | null;
  title?: string | null;
  level?: Level | null;
  day: Day;
  startTime: string;
  endTime: string;
  order?: number | null;
};

type Row = { day: Day; startTime: string; endTime: string; order: number };
type LevelGroup = { level: Level | null; rows: Row[] };
type Card = {
  key: string;
  name: string;
  weaponSlug?: string;
  order: number;
  levelGroups: LevelGroup[];
};

function buildCards(entries: ScheduleEntryDoc[]): Card[] {
  const groups = new Map<
    string,
    {
      name: string;
      weaponSlug?: string;
      order: number;
      rowsByLevel: Map<string, Row[]>;
    }
  >();

  for (const entry of entries) {
    const weapon =
      entry.weapon && typeof entry.weapon === "object" ? entry.weapon : null;
    const key = weapon ? `weapon:${weapon.id}` : `title:${entry.title}`;
    const order = entry.order ?? 0;

    let group = groups.get(key);
    if (!group) {
      group = {
        name: weapon ? weapon.name : (entry.title ?? ""),
        weaponSlug: weapon?.slug,
        order,
        rowsByLevel: new Map(),
      };
      groups.set(key, group);
    }
    group.order = Math.min(group.order, order);

    const levelKey = entry.level ?? "";
    const rows = group.rowsByLevel.get(levelKey) ?? [];
    rows.push({
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      order,
    });
    group.rowsByLevel.set(levelKey, rows);
  }

  return Array.from(groups.values())
    .map((group) => {
      const levelGroups = Array.from(group.rowsByLevel.entries())
        .map(([level, rows]) => {
          const sortedRows = [...rows].sort((a, b) => a.order - b.order);
          return {
            level: (level || null) as Level | null,
            rows: sortedRows,
            minOrder: sortedRows[0]?.order ?? 0,
          };
        })
        .sort((a, b) => a.minOrder - b.minOrder);

      return {
        key: group.name,
        name: group.name,
        weaponSlug: group.weaponSlug,
        order: group.order,
        levelGroups,
      };
    })
    .sort((a, b) => a.order - b.order);
}

function ScheduleCard({ card, t }: { card: Card; t: TFunc }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-night/15 bg-paper-100/40 p-5">
      <div className="flex items-center gap-3">
        {card.weaponSlug && (
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src={`/images/weapons/${card.weaponSlug}.png`}
              alt=""
              aria-hidden
              fill
              className="object-contain"
            />
          </div>
        )}
        <Heading variant="h3" className="text-night">
          {card.name}
        </Heading>
      </div>
      <div className="grid gap-3">
        {card.levelGroups.map((group, i) => (
          <div key={group.level ?? i} className="flex flex-col gap-1">
            {group.level && (
              <span className="text-sm font-semibold tracking-wide text-gold-200 uppercase">
                {t(`levels.${group.level}`)}
              </span>
            )}
            <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm text-night">
              {group.rows.map((row, idx) => (
                <Fragment key={idx}>
                  <span>{t(`days.${row.day}`)}</span>
                  <span className="text-right tabular-nums">
                    {row.startTime} – {row.endTime}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleFullRow({ card, t }: { card: Card; t: TFunc }) {
  const rows = card.levelGroups.flatMap((group) => group.rows);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-night/15 bg-paper-100/40 p-5 sm:flex-row sm:items-center sm:justify-between">
      <Heading variant="h3" className="text-night">
        {card.name}
      </Heading>
      <div className="flex flex-col gap-1 text-sm text-night sm:items-end">
        {rows.map((row, idx) => (
          <div key={idx} className="flex gap-4">
            <span>{t(`days.${row.day}`)}</span>
            <span className="tabular-nums">
              {row.startTime} – {row.endTime}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Schedule() {
  const locale = await getLocale();
  const t = await getTranslations("Schedule");
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "schedule-entries",
    depth: 2,
    limit: 100,
    locale: locale as "en" | "ka" | "ru",
    sort: "order",
  });

  const entries = docs as ScheduleEntryDoc[];
  const cards = buildCards(entries);
  const weaponCards = cards.filter((card) => card.weaponSlug);
  const plainCards = cards.filter((card) => !card.weaponSlug);

  return (
    <div className="w-full rounded-[40px] bg-gold-100 p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <Heading variant="h1" as="h2" className="text-night">
          {t("title")}
        </Heading>
        <a
          href="https://maps.app.goo.gl/HEMBpPfnXB1XGGXq7"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col rounded-xl border border-night/20 bg-paper-100/60 px-4 py-3 text-sm text-night"
        >
          <span>{t("addressLine1")}</span>
          <span className="text-night/60">{t("addressLine2")}</span>
        </a>
      </div>

      {cards.length > 0 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4">
            {weaponCards.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {weaponCards.map((card) => (
                  <ScheduleCard key={card.key} card={card} t={t} />
                ))}
              </div>
            )}
            {plainCards.map((card) => (
              <ScheduleFullRow key={card.key} card={card} t={t} />
            ))}
          </div>

          <div className="relative hidden min-h-64 overflow-hidden rounded-2xl border border-night/20 lg:block">
            <Image
              src="/images/training1.jpg"
              alt=""
              aria-hidden
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
