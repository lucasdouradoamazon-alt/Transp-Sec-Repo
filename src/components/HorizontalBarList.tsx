export type BarItem = {
  key: string;
  label: string;
  valueRaw: number;
  color: string;
  icon?: React.ReactNode;
  tooltip: string;
};

export function HorizontalBarList({
  title,
  items,
  valueLabel,
}: {
  title: string;
  items: BarItem[];
  valueLabel: (raw: number) => string;
}) {
  const max = Math.max(...items.map((i) => i.valueRaw), 1);

  return (
    <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => {
          const pct = Math.max((item.valueRaw / max) * 100, 2);
          return (
            <div key={item.key} className="group relative flex items-center gap-3">
              <div
                className="w-36 shrink-0 truncate text-xs text-[var(--text-secondary)]"
                title={item.label}
              >
                {item.icon}
                {item.label}
              </div>
              <div className="h-8 flex-1 flex items-center">
                <div
                  className="h-4 rounded-r-[4px] transition-[filter]"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <div className="tabular w-24 shrink-0 text-right text-xs text-[var(--text-secondary)]">
                {valueLabel(item.valueRaw)}
              </div>
              <div className="pointer-events-none absolute -top-8 left-36 z-10 hidden whitespace-nowrap rounded border border-[var(--border-hairline)] bg-[var(--surface-1)] px-2 py-1 text-xs text-[var(--text-primary)] shadow-sm group-hover:block">
                {item.tooltip}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
