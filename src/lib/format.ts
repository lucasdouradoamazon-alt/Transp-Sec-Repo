export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatBRLCompact(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

const LINK_LABELS: [pattern: string, label: string][] = [
  ["youtube.com", "Vídeo (YouTube)"],
  ["youtu.be", "Vídeo (YouTube)"],
  ["vimeo.com", "Vídeo (Vimeo)"],
  ["drive.google.com", "Arquivo (Google Drive)"],
  ["instagram.com", "Instagram"],
  ["facebook.com", "Facebook"],
];

export function labelResultadoLink(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const found = LINK_LABELS.find(([pattern]) => host.includes(pattern));
    return found ? found[1] : "Material";
  } catch {
    return "Material";
  }
}
