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

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Tbilisi",
});

function formatTime(value: string): string {
  return timeFormatter.format(new Date(value));
}

type WeaponRef = {
  id: string;
  name: string;
  slug: string;
};

type ScheduleRow = {
  level?: Level | null;
  day: Day;
  startTime: string;
  endTime: string;
};

type ScheduleGroupDoc = {
  id: string;
  weapon?: WeaponRef | string | null;
  title?: string | null;
  rows?: ScheduleRow[] | null;
};

function groupRowsByLevel(rows: ScheduleRow[]) {
  const byLevel = new Map<string, ScheduleRow[]>();
  for (const row of rows) {
    const key = row.level ?? "";
    const bucket = byLevel.get(key) ?? [];
    bucket.push(row);
    byLevel.set(key, bucket);
  }
  return Array.from(byLevel.entries()).map(([level, levelRows]) => ({
    level: (level || null) as Level | null,
    rows: levelRows,
  }));
}

function ScheduleCard({
  doc,
  t,
  className = "",
}: {
  doc: ScheduleGroupDoc;
  t: TFunc;
  className?: string;
}) {
  const weapon =
    doc.weapon && typeof doc.weapon === "object" ? doc.weapon : null;
  const levelGroups = groupRowsByLevel(doc.rows ?? []);

  return (
    <div
      className={`flex flex-col rounded-lg border border-night/25 p-6 ${className}`}
    >
      {weapon && (
        <div className="relative h-16 w-full">
          <Image
            src={`/images/weapons/${weapon.slug}.png`}
            alt=""
            aria-hidden
            fill
            className="object-contain object-left"
          />
        </div>
      )}
      <Heading variant="h3" className="mt-2 text-night">
        {weapon?.name}
      </Heading>
      <div className="mt-4 flex flex-col divide-y divide-night/20 border-t border-night/20">
        {levelGroups.map((group, i) => (
          <div key={group.level ?? i} className="flex flex-col gap-2 py-4">
            {group.level && (
              <span className="font-semibold text-night">
                {t(`levels.${group.level}`)}
              </span>
            )}
            <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-night">
              {group.rows.map((row, idx) => (
                <Fragment key={idx}>
                  <span className="text-md">{t(`days.${row.day}`)}</span>
                  <span className="text-right font-semibold tabular-nums">
                    {formatTime(row.startTime)} – {formatTime(row.endTime)}
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

function ScheduleFullRow({ doc, t }: { doc: ScheduleGroupDoc; t: TFunc }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-night/15 p-5 sm:flex-row sm:items-center sm:justify-between">
      <Heading variant="h3" className="text-night">
        {doc.title}
      </Heading>
      <div className="flex flex-col gap-1 text-sm text-night sm:items-end">
        {(doc.rows ?? []).map((row, idx) => (
          <div key={idx} className="flex gap-4">
            <span className="text-md">{t(`days.${row.day}`)}</span>
            <span className="text-right font-semibold tabular-nums">
              {formatTime(row.startTime)} – {formatTime(row.endTime)}
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
    collection: "schedule-groups",
    depth: 2,
    limit: 100,
    locale: locale as "en" | "ka" | "ru",
  });

  const groups = docs as ScheduleGroupDoc[];
  const weaponSlug = (doc: ScheduleGroupDoc) =>
    doc.weapon && typeof doc.weapon === "object" ? doc.weapon.slug : null;

  const longsword = groups.find((doc) => weaponSlug(doc) === "longsword");
  const saber = groups.find((doc) => weaponSlug(doc) === "saber");
  const rapier = groups.find((doc) => weaponSlug(doc) === "rapier");
  const sparrings = groups.find((doc) => !doc.weapon);

  const hasSchedule = Boolean(longsword || saber || rapier || sparrings);

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

      {hasSchedule && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-6">
              {longsword && (
                <ScheduleCard doc={longsword} t={t} className="row-span-2" />
              )}
              {saber && <ScheduleCard doc={saber} t={t} />}
              {rapier && <ScheduleCard doc={rapier} t={t} />}
            </div>
            {sparrings && <ScheduleFullRow doc={sparrings} t={t} />}
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
