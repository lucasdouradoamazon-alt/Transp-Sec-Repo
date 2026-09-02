"use client";

import { useEffect, useRef, useState } from "react";

/** Botão "Denunciar irregularidade" -- ao clicar, mostra uma caixa
 * intermediária explicando o que pode ser denunciado e como, antes de levar
 * a pessoa pro link externo da Ouvidoria. Conteúdo do texto definido pelo
 * usuário (2026-09-02). */
export function BotaoDenuncia({ href }: { href: string | null }) {
  const [aberto, setAberto] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setAberto(false);
    }
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [aberto]);

  if (!href) {
    return (
      <span
        title="Link da Ouvidoria em configuração"
        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded border border-dashed border-[var(--border-hairline)] px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] opacity-70"
      >
        Denunciar irregularidade
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="inline-flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
      >
        Denunciar irregularidade
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setAberto(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-denuncia"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-6 text-[var(--text-primary)] shadow-xl"
          >
            <h2 id="titulo-denuncia" className="text-lg font-semibold">
              Encontrou alguma irregularidade? Conte para a gente.
            </h2>

            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Este Portal apresenta informações sobre recursos públicos
              destinados ao apoio de projetos, ações e iniciativas culturais
              realizados pela Secretaria de Estado da Cultura.
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Se você identificar alguma possível irregularidade relacionada
              a um apoio divulgado aqui, poderá comunicar à Secretaria para
              que a situação seja analisada.
            </p>

            <p className="mt-4 text-sm font-medium text-[var(--text-primary)]">
              Você pode denunciar, por exemplo:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
              <li>projeto ou atividade que recebeu recursos, mas não foi realizado;</li>
              <li>informações divulgadas no Portal que não correspondem ao que foi efetivamente executado;</li>
              <li>utilização dos recursos para finalidade diferente daquela prevista;</li>
              <li>cobrança indevida para participação em atividade que deveria ser gratuita;</li>
              <li>projeto, evento ou ação executado de forma diferente do que foi aprovado;</li>
              <li>possível uso indevido de recursos públicos;</li>
              <li>outras situações que indiquem que o apoio concedido não foi utilizado da forma prevista.</li>
            </ul>

            <p className="mt-4 text-sm font-medium text-[var(--text-primary)]">
              Como denunciar?
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              É simples. Informe qual é o projeto, evento, entidade ou apoio
              relacionado à denúncia e conte, com suas próprias palavras, o
              que aconteceu.
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Se tiver fotos, vídeos, documentos, links, publicações,
              comprovantes ou outras informações que possam ajudar a
              entender a situação, você também poderá enviá-los.
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Você não precisa conhecer as regras do programa ou saber qual
              norma pode ter sido descumprida. Basta explicar o que você
              identificou. A Secretaria ficará responsável por analisar as
              informações e verificar se há necessidade de alguma
              providência.
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              As informações encaminhadas contribuirão para a fiscalização
              dos recursos públicos e para o fortalecimento da transparência
              e das políticas culturais.
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setAberto(false)}
                className="rounded border border-[var(--border-hairline)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--gridline)]"
              >
                Cancelar
              </button>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setAberto(false)}
                className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                Faça sua denúncia ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
