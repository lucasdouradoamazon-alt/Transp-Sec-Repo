"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Registro } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { sha256Hex } from "@/lib/sha256";

const TAMANHOS_PAGINA = [20, 50, 100];

function apenasDigitos(v: string): string {
  return v.replace(/\D/g, "");
}

function unique(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}

function toCsv(rows: Registro[]): string {
  const header = [
    "fonte",
    "edital_numero",
    "edital_nome",
    "tipo_proponente",
    "nome_proponente",
    "documento_mascarado",
    "municipio",
    "regional",
    "titulo",
    "situacao",
    "valor",
  ];
  const lines = rows.map((r) =>
    header
      .map((h) => {
        const v = (r as unknown as Record<string, unknown>)[h];
        const s = v === null || v === undefined ? "" : String(v);
        return `"${s.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export function RegistrosTable({ registros }: { registros: Registro[] }) {
  const [busca, setBusca] = useState("");
  const [fonte, setFonte] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");
  const [regional, setRegional] = useState("");
  const [pagina, setPagina] = useState(1);
  const [tamanhoPagina, setTamanhoPagina] = useState(20);

  const fontes = useMemo(() => unique(registros.map((r) => r.fonte)), [registros]);
  const municipios = useMemo(() => unique(registros.map((r) => r.municipio)), [registros]);
  const situacoes = useMemo(() => unique(registros.map((r) => r.situacao)), [registros]);
  const regionais = useMemo(
    () =>
      unique(registros.map((r) => r.regional)).sort(
        (a, b) => parseInt(a, 10) - parseInt(b, 10)
      ),
    [registros]
  );

  // se o termo de busca, sem formatacao, tiver 11 ou 14 digitos, trata como
  // busca por CPF/CNPJ completo (match exato por hash) em vez de busca
  // textual por nome/projeto/municipio -- o hash evita publicar o numero
  // completo em claro no JSON (so os 2 ultimos digitos ficam visiveis).
  const buscaDigitos = apenasDigitos(busca);
  const hashBusca = useMemo(() => {
    if (buscaDigitos.length !== 11 && buscaDigitos.length !== 14) return null;
    return sha256Hex(buscaDigitos);
  }, [buscaDigitos]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return registros.filter((r) => {
      if (fonte && r.fonte !== fonte) return false;
      if (municipio && r.municipio !== municipio) return false;
      if (situacao && r.situacao !== situacao) return false;
      if (regional && r.regional !== regional) return false;
      if (hashBusca) {
        if (r.documento_hash !== hashBusca) return false;
      } else if (termo) {
        const alvo = `${r.nome_proponente ?? ""} ${r.titulo ?? ""} ${r.municipio ?? ""}`.toLowerCase();
        if (!alvo.includes(termo)) return false;
      }
      return true;
    });
  }, [registros, busca, hashBusca, fonte, municipio, situacao, regional]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / tamanhoPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const pageItems = filtrados.slice(
    (paginaAtual - 1) * tamanhoPagina,
    paginaAtual * tamanhoPagina
  );

  function atualizarFiltro(setter: (v: string) => void, v: string) {
    setter(v);
    setPagina(1);
  }

  function exportarCsv() {
    const csv = toCsv(filtrados);
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registros_transparencia.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-muted)]">Buscar</label>
          <input
            value={busca}
            onChange={(e) => atualizarFiltro(setBusca, e.target.value)}
            placeholder="Proponente, projeto, município, CPF ou CNPJ…"
            className="w-64 rounded border border-[var(--border-hairline)] bg-[var(--surface-1)] px-3 py-1.5 text-sm text-[var(--text-primary)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-muted)]">Fonte</label>
          <select
            value={fonte}
            onChange={(e) => atualizarFiltro(setFonte, e.target.value)}
            className="rounded border border-[var(--border-hairline)] bg-[var(--surface-1)] px-3 py-1.5 text-sm text-[var(--text-primary)]"
          >
            <option value="">Todas</option>
            {fontes.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-muted)]">Município</label>
          <select
            value={municipio}
            onChange={(e) => atualizarFiltro(setMunicipio, e.target.value)}
            className="rounded border border-[var(--border-hairline)] bg-[var(--surface-1)] px-3 py-1.5 text-sm text-[var(--text-primary)]"
          >
            <option value="">Todos</option>
            {municipios.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-muted)]">Situação</label>
          <select
            value={situacao}
            onChange={(e) => atualizarFiltro(setSituacao, e.target.value)}
            className="rounded border border-[var(--border-hairline)] bg-[var(--surface-1)] px-3 py-1.5 text-sm text-[var(--text-primary)]"
          >
            <option value="">Todas</option>
            {situacoes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-muted)]">Regional</label>
          <select
            value={regional}
            onChange={(e) => atualizarFiltro(setRegional, e.target.value)}
            className="rounded border border-[var(--border-hairline)] bg-[var(--surface-1)] px-3 py-1.5 text-sm text-[var(--text-primary)]"
          >
            <option value="">Todas</option>
            {regionais.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={exportarCsv}
          className="ml-auto rounded border border-[var(--border-hairline)] bg-[var(--surface-1)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--gridline)]"
        >
          Exportar CSV ({filtrados.length})
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border-hairline)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-hairline)] bg-[var(--surface-1)] text-xs text-[var(--text-muted)]">
              <th className="px-3 py-2 font-medium">Fonte</th>
              <th className="px-3 py-2 font-medium">Proponente</th>
              <th className="px-3 py-2 font-medium">Documento</th>
              <th className="px-3 py-2 font-medium">Município</th>
              <th className="px-3 py-2 font-medium">Projeto/edital</th>
              <th className="px-3 py-2 font-medium">Situação</th>
              <th className="tabular px-3 py-2 text-right font-medium">Valor</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((r) => (
              <tr
                key={r.id}
                className="border-b border-[var(--border-hairline)] last:border-0 hover:bg-[var(--gridline)]/40"
              >
                <td className="px-3 py-2 text-[var(--text-secondary)]">{r.fonte}</td>
                <td className="px-3 py-2 text-[var(--text-primary)]">
                  {r.nome_proponente ?? "—"}
                  {r.is_exemplo && (
                    <span className="ml-2 rounded bg-[var(--gridline)] px-1.5 py-0.5 text-[10px] font-medium uppercase text-[var(--text-muted)]">
                      Demonstração
                    </span>
                  )}
                </td>
                <td className="tabular px-3 py-2 text-[var(--text-muted)]">
                  {r.documento_mascarado ?? "—"}
                </td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">
                  {r.municipio ?? "—"}
                </td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">
                  {r.titulo ?? "—"}
                </td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">
                  {r.situacao ?? "—"}
                </td>
                <td className="tabular px-3 py-2 text-right text-[var(--text-primary)]">
                  {formatBRL(r.valor)}
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/registros/${r.id}`}
                    className="text-xs font-medium text-[var(--series-1)] hover:underline"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-[var(--text-muted)]">
                  Nenhum registro encontrado com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
        <span>
          {filtrados.length} registros — página {paginaAtual} de {totalPaginas}
        </span>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            Por página
            <select
              value={tamanhoPagina}
              onChange={(e) => {
                setTamanhoPagina(Number(e.target.value));
                setPagina(1);
              }}
              className="rounded border border-[var(--border-hairline)] bg-[var(--surface-1)] px-2 py-1 text-[var(--text-primary)]"
            >
              {TAMANHOS_PAGINA.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="rounded border border-[var(--border-hairline)] px-2 py-1 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
              className="rounded border border-[var(--border-hairline)] px-2 py-1 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
