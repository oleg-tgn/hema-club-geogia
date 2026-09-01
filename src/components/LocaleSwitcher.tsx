"use client";

import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

const labels: Record<string, string> = {
  ru: "RU",
  ka: "GE",
  en: "EN",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-2">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`px-2 py-1 text-sm rounded transition ${
            loc === locale
              ? "bg-red-600 text-white"
              : "text-gray-200 hover:text-white"
          }`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
