import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const t = useTranslations("Nav");

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold">
          St. George&apos;s HEMA School
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-red-400">
            {t("home")}
          </Link>
          <Link href="/about" className="hover:text-red-400">
            {t("about")}
          </Link>
          <Link href="/tournament" className="hover:text-red-400">
            {t("tournament")}
          </Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
