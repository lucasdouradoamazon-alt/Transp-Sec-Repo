export function Campo({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  const display = value && value !== "-" ? value : "—";
  return (
    <div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
      <div className="mt-0.5 text-sm text-[var(--text-primary)]">{display}</div>
    </div>
  );
}

export function Secao({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-5">
      <h2 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {children}
      </div>
    </div>
  );
}
