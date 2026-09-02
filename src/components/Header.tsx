"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { JOIN_URL } from "@/lib/constants";
import { useActiveSection } from "./ActiveSectionProvider";
import LocaleSwitcher from "./LocaleSwitcher";
import Logo from "./Logo";

const menuLinks = [
  { href: "/#about", labelKey: "about", section: "about" },
  { href: "/#schedule", labelKey: "schedule", section: "schedule" },
  // { href: "/#weapons", labelKey: "weapons", section: "weapons" },
  { href: "/#instructors", labelKey: "instructors", section: "instructors" },
  { href: "/#gallery", labelKey: "gallery", section: "gallery" },
  { href: "/tournament", labelKey: "tournaments", section: null },
] as const;

function MenuLink({
  href,
  section,
  isHome,
  isActive,
  children,
}: {
  href: string;
  section: string | null;
  isHome: boolean;
  isActive: boolean;
  children: React.ReactNode;
}) {
  const className = `group relative text-base leading-6 font-semibold text-asphalt hover:text-night ${
    isActive ? "text-night" : ""
  }`;
  const underline = (
    <span
      className={`absolute -bottom-1 left-1/2 h-px w-5 -translate-x-1/2 ${
        isActive ? "bg-gold-100" : "bg-transparent group-hover:bg-gold-100"
      }`}
    />
  );

  // On the home page, section anchors are plain in-page links: the browser
  // handles the scroll natively, so repeat clicks always work even if
  // next/link's client router thinks the URL hasn't changed.
  if (section && isHome) {
    return (
      <a href={`#${section}`} className={className}>
        {children}
        {underline}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      {underline}
    </Link>
  );
}

export default function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { activeSection } = useActiveSection();
  const isHome = pathname === "/";
  const currentSection = isHome ? activeSection : null;

  return (
    <header className="sticky top-0 z-50 container mx-auto bg-paper-100 px-10">
      <div className="py-4 flex items-center justify-between">
        <Link href="/" className="group">
          <Logo className="h-5 w-auto" />
        </Link>
        <nav className="flex items-center gap-8">
          {menuLinks.map(({ href, labelKey, section }) => (
            <MenuLink
              key={href}
              href={href}
              section={section}
              isHome={isHome}
              isActive={
                section ? currentSection === section : pathname === href
              }
            >
              {t(labelKey)}
            </MenuLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8.5 items-center justify-center rounded-3xl border border-asphalt px-4 text-base leading-6 font-semibold text-night transition-colors hover:bg-night/5"
          >
            {t("join")}
          </a>
        </div>
      </div>
    </header>
  );
}
