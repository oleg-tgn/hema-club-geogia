"use client";

import { useEffect } from "react";

// Tracks which of the given section ids is currently most visible below the
// sticky header and reports it via onChange. Decoupled from navigation: it
// only watches the DOM, so it doesn't care whether the scroll was triggered
// by next/link, a plain <a href="#...">, or the user scrolling by hand.
export function useActiveSectionObserver(
  sectionIds: readonly string[],
  enabled: boolean,
  onChange: (id: string | null) => void,
) {
  useEffect(() => {
    if (!enabled) return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const headerHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
      ) || 0;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        onChange(bestId);
      },
      {
        rootMargin: `-${headerHeight}px 0px -60% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds, enabled, onChange]);
}
