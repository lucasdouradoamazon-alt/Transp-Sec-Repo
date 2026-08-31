export type PieSlice = {
  key: string;
  label: string;
  value: number;
  color: string;
};

function buildSlicePath(cx: number, cy: number, r: number, startFrac: number, endFrac: number): string {
  const fraction = endFrac - startFrac;
  if (fraction >= 0.9999) {
    // circulo completo: arco de 360 graus precisa de 2 semicirculos
    return [
      `M ${cx} ${cy - r}`,
      `A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r}`,
      "Z",
    ].join(" ");
  }
  const startAngle = startFrac * 2 * Math.PI;
  const endAngle = endFrac * 2 * Math.PI;
  const x1 = cx + r * Math.sin(startAngle);
  const y1 = cy - r * Math.cos(startAngle);
  const x2 = cx + r * Math.sin(endAngle);
  const y2 = cy - r * Math.cos(endAngle);
  const largeArc = fraction > 0.5 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
    "Z",
  ].join(" ");
}

export function PieChart({
  title,
  slices,
  valueLabel,
  centerLabel,
  note,
}: {
  title: string;
  slices: PieSlice[];
  valueLabel: (raw: number) => string;
  /** rotulo pequeno embaixo do numero central (ex: "registros", "total") */
  centerLabel?: string;
  note?: string;
}) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const cx = 50;
  const cy = 50;
  const r = 48;

  let cumulative = 0;
  const paths = slices
    .filter((s) => s.value > 0)
    .map((slice) => {
      const startFrac = cumulative;
      const fraction = total > 0 ? slice.value / total : 0;
      cumulative += fraction;
      return { slice, fraction, d: buildSlicePath(cx, cy, r, startFrac, cumulative) };
    });

  return (
    <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-1)] p-6">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      {total === 0 ? (
        <p className="mt-4 text-xs text-[var(--text-muted)]">Sem dados suficientes ainda.</p>
      ) : (
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <svg viewBox="0 0 100 100" className="h-40 w-40 shrink-0" role="img" aria-label={title}>
            {paths.map(({ slice, d }) => (
              <path key={slice.key} d={d} fill={slice.color} stroke="var(--surface-1)" strokeWidth="1.5">
                <title>{`${slice.label}: ${valueLabel(slice.value)} (${Math.round((slice.value / total) * 100)}%)`}</title>
              </path>
            ))}
            <circle cx={cx} cy={cy} r={r * 0.6} fill="var(--surface-1)" />
            <text
              x={cx}
              y={cy - 2}
              textAnchor="middle"
              style={{ fill: "var(--text-primary)", fontSize: "13px", fontWeight: 600 }}
            >
              {valueLabel(total)}
            </text>
            {centerLabel && (
              <text
                x={cx}
                y={cy + 10}
                textAnchor="middle"
                style={{ fill: "var(--text-muted)", fontSize: "6.5px" }}
              >
                {centerLabel}
              </text>
            )}
          </svg>
          <div className="flex w-full min-w-0 flex-1 flex-col gap-2.5">
            {paths.map(({ slice, fraction }) => (
              <div key={slice.key} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span
                  className="min-w-0 flex-1 truncate text-[var(--text-secondary)]"
                  title={slice.label}
                >
                  {slice.label}
                </span>
                <span className="tabular shrink-0 text-[var(--text-muted)]">
                  {Math.round(fraction * 100)}%
                </span>
                <span className="tabular shrink-0 text-right font-medium text-[var(--text-primary)]">
                  {valueLabel(slice.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {note && <p className="mt-4 text-[11px] leading-relaxed text-[var(--text-muted)]">{note}</p>}
    </div>
  );
}
