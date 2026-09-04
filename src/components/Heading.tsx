import type { ElementType, ReactNode } from "react";

type HeadingVariant = "h1" | "h2" | "h3";

const variantStyles: Record<HeadingVariant, string> = {
  h1: "font-serif text-7xl font-normal leading-none tracking-tight text-night",
  h2: "font-serif text-6xl font-normal leading-none tracking-tight text-night",
  h3: "font-serif text-3xl font-normal leading-none tracking-tight text-night",
};

type HeadingProps = {
  variant: HeadingVariant;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
};

export default function Heading({
  variant,
  as,
  className = "",
  children,
}: HeadingProps) {
  const Tag = as ?? variant;

  return (
    <Tag className={`${variantStyles[variant]} ${className}`}>{children}</Tag>
  );
}
