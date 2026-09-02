/** Botão de contato (denúncia, sugestão) que aceita não ter destino ainda --
 * fica visível porém desabilitado em vez de sumir ou apontar pra um link
 * quebrado, até o destino real ser configurado em src/lib/contato.ts. */
export function BotaoContato({
  label,
  href,
  pendingHint,
  variant = "neutro",
}: {
  label: string;
  href: string | null;
  pendingHint: string;
  /** "alerta" -- vermelho claro, pro botão de denúncia; discreto de propósito,
   * só o suficiente pra chamar mais atenção que o botão neutro de sugestão. */
  variant?: "neutro" | "alerta";
}) {
  if (!href) {
    return (
      <span
        title={pendingHint}
        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded border border-dashed border-[var(--border-hairline)] px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] opacity-70"
      >
        {label}
      </span>
    );
  }
  const externo = href.startsWith("http");
  const estilo =
    variant === "alerta"
      ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      : "border-[var(--border-hairline)] text-[var(--text-primary)] hover:bg-[var(--gridline)]";
  return (
    <a
      href={href}
      target={externo ? "_blank" : undefined}
      rel={externo ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-sm font-medium ${estilo}`}
    >
      {label}
    </a>
  );
}
