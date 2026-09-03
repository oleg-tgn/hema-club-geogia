"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useActiveSectionObserver } from "@/hooks/useActiveSectionObserver";
import { useActiveSection } from "./ActiveSectionProvider";
import LocaleSwitcher from "./LocaleSwitcher";
import Logo from "./Logo";

const menuLinks = [
  { href: "/#about", labelKey: "about", section: "about" },
  { href: "/#schedule", labelKey: "schedule", section: "schedule" },
  { href: "/#weapons", labelKey: "weapons", section: "weapons" },
  { href: "/#instructors", labelKey: "instructors", section: "instructors" },
  { href: "/#gallery", labelKey: "gallery", section: "gallery" },
  { href: "/tournament", labelKey: "tournaments", section: null },
] as const;

const sectionIds = menuLinks
  .map((link) => link.section)
  .filter(
    (section): section is NonNullable<typeof section> => section !== null,
  );

function MenuLink({
  href,
  section,
  isHome,
  className,
  children,
}: {
  href: string;
  section: string | null;
  isHome: boolean;
  className: string;
  children: React.ReactNode;
}) {
  // On the home page, section anchors are plain in-page links: the browser
  // handles the scroll natively, so repeat clicks always work even if
  // next/link's client router thinks the URL hasn't changed.
  if (section !== null && isHome) {
    return (
      <a href={`#${section}`} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function Nav({
  pathname,
  currentSection,
  isHome,
}: {
  pathname: string;
  currentSection: string | null;
  isHome: boolean;
}) {
  const t = useTranslations("Nav");

  return (
    <nav className="flex items-center gap-8">
      {menuLinks.map(({ href, labelKey, section }) => {
        const isActive = section
          ? currentSection === section
          : pathname === href;

        return (
          <MenuLink
            key={href}
            href={href}
            section={section}
            isHome={isHome}
            className={`group relative text-base leading-6 font-semibold text-asphalt hover:text-night ${
              isActive ? "text-night" : ""
            }`}
          >
            {t(labelKey)}
            <span
              className={`absolute -bottom-1 left-1/2 h-px w-5 -translate-x-1/2 ${
                isActive
                  ? "bg-gold-100"
                  : "bg-transparent group-hover:bg-gold-100"
              }`}
            />
          </MenuLink>
        );
      })}
    </nav>
  );
}

export default function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { activeSection, setActiveSection } = useActiveSection();
  const isHome = pathname === "/";
  const currentSection = isHome ? activeSection : null;

  useActiveSectionObserver(sectionIds, isHome, setActiveSection);

  return (
    <header className="sticky top-0 z-50 container mx-auto bg-paper-100 px-10">
      <div className="py-4 flex items-center justify-between">
        <MenuLink href="/" section="" isHome={isHome} className="group">
          <Logo className="h-5 w-auto" />
        </MenuLink>
        <Nav
          pathname={pathname}
          currentSection={currentSection}
          isHome={isHome}
        />
        <div className="flex items-center gap-4">
          <LocaleSwitcher />

          <MenuLink
            href="#join"
            section="join"
            isHome={isHome}
            className="flex h-8.5 items-center justify-center rounded-3xl border border-asphalt px-4 text-base leading-6 font-semibold text-night transition-colors hover:bg-night/5"
          >
            {t("join")}
          </MenuLink>
        </div>
      </div>
    </header>
  );
}
