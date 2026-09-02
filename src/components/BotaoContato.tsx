/** Botão de contato (sugestão) que aceita não ter destino ainda -- fica
 * visível porém desabilitado em vez de sumir ou apontar pra um link
 * quebrado, até o destino real ser configurado em src/lib/contato.ts. */
export function BotaoContato({
  label,
  href,
  pendingHint,
}: {
  label: string;
  href: string | null;
  pendingHint: string;
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
  return (
    <a
      href={href}
      target={externo ? "_blank" : undefined}
      rel={externo ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1.5 rounded border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-100"
    >
      {label}
    </a>
  );
}
