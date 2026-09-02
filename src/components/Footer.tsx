import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";

export default async function Footer() {
  const t = await getTranslations("Contact");

  return (
    <footer className="container px-10">
      <div className="py-4 flex justify-between items-center">
        <Link href="/" className="group">
          <Logo className="h-6.5 w-auto" />
        </Link>
        <p className="text-base leading-6 font-semibold text-asphalt">
          {t("address")}
        </p>
        <div />
      </div>
    </footer>
  );
}
