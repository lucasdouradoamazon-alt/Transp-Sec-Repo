"use client";

import { useState } from "react";

/** Mostra o e-mail de sugestões como texto e copia pra área de transferência
 * ao clicar -- evita depender de mailto: (só funciona com cliente de e-mail
 * padrão configurado) ou de forçar um provedor específico. */
export function BotaoCopiarEmail({ email }: { email: string | null }) {
  const [copiado, setCopiado] = useState(false);

  if (!email) {
    return (
      <span
        title="E-mail de sugestões em configuração"
        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded border border-dashed border-[var(--border-hairline)] px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] opacity-70"
      >
        Tem sugestão de melhorias?
      </span>
    );
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(email!);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // clipboard API pode falhar (permissão negada, contexto não seguro
      // etc.) -- sem tratamento especial, o e-mail continua visível pra
      // seleção manual.
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      title="Clique para copiar"
      className="inline-flex items-center gap-1.5 rounded border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-100"
    >
      {copiado ? "E-mail copiado!" : `Sugestões: ${email}`}
    </button>
  );
}
