export function StatTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-5">
      <div className="text-sm text-[var(--text-secondary)]">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
        {value}
      </div>
    </div>
  );
}
