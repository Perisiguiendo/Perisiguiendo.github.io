import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolPage({ title, description, children }: Props) {
  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold md:text-3xl"
          style={{ color: "var(--color-text)" }}
        >
          {title}
        </h1>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
