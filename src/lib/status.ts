export type StatusKind = "good" | "warning" | "serious" | "critical" | "neutral";

const STATUS_MAP: Record<string, StatusKind> = {
  PAGO: "good",
  "NÃO PAGO": "critical",
  CANCELADO: "critical",
  "DESISTÊNCIA": "serious",
  "NÃO CONTRATADO": "warning",
  DESCONTINUADO: "warning",
  "DEVOLUÇÃO": "warning",
};

export function statusKind(situacao: string): StatusKind {
  return STATUS_MAP[situacao.toUpperCase()] ?? "neutral";
}

export function statusColorVar(kind: StatusKind): string {
  switch (kind) {
    case "good":
      return "var(--status-good)";
    case "warning":
      return "var(--status-warning)";
    case "serious":
      return "var(--status-serious)";
    case "critical":
      return "var(--status-critical)";
    default:
      return "var(--text-muted)";
  }
}
