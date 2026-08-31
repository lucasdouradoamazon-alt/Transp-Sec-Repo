"use client";

import { useState } from "react";
import { HorizontalBarList, type BarItem } from "./HorizontalBarList";
import { formatBRLCompact } from "@/lib/format";

const valueLabel = (raw: number) => formatBRLCompact(raw);

export function MunicipiosList({
  items,
  initialCount = 10,
}: {
  items: BarItem[];
  initialCount?: number;
}) {
  const [expandido, setExpandido] = useState(false);
  const visiveis = expandido ? items : items.slice(0, initialCount);

  return (
    <div>
      <HorizontalBarList
        title={
          expandido
            ? `Valor investido por município (todos os ${items.length})`
            : `Valor investido por município (top ${initialCount})`
        }
        items={visiveis}
        valueLabel={valueLabel}
      />
      {items.length > initialCount && (
        <button
          onClick={() => setExpandido((v) => !v)}
          className="mt-3 text-sm font-medium text-[var(--series-1)] hover:underline"
        >
          {expandido ? "← Mostrar só os principais" : `Ver todos os ${items.length} municípios →`}
        </button>
      )}
    </div>
  );
}
