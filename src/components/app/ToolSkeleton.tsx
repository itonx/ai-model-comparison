import { ui } from "./uiClasses";

export default function ToolSkeleton() {
  return (
    <section className={`${ui.toolCard} gap-3`}>
      <div className="h-7 w-2/5 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))]" />
      <div className="h-4 w-2/3 animate-pulse rounded-lg bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))]" />
      <div className="h-4 w-2/3 animate-pulse rounded-lg bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))]" />
      <div className="h-28 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))]" />
      <div className="h-28 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))]" />
    </section>
  );
}
