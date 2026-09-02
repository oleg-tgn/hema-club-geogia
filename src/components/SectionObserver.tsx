"use client";

import { useInView } from "react-intersection-observer";
import { useActiveSection } from "./ActiveSectionProvider";

export default function SectionObserver({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { setActiveSection } = useActiveSection();
  const { ref } = useInView({
    rootMargin: "-45% 0px -50% 0px",
    onChange: (inView) => {
      if (inView) setActiveSection(id);
    },
  });

  return (
    <section id={id} ref={ref} className={className}>
      {children}
    </section>
  );
}
