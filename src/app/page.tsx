import Link from "next/link";
import { getDashboard } from "@/lib/data";
import { StatTile } from "@/components/StatTile";
import { type BarItem } from "@/components/HorizontalBarList";
import { MunicipiosList } from "@/components/MunicipiosList";
import { PieChart, type PieSlice } from "@/components/PieChart";
import { formatBRL, formatBRLCompact, formatNumber } from "@/lib/format";

export const dynamic = "force-static";

// paleta categorica fixa do site (8 series, ordem fixa — nunca ciclada além
// de 8, nunca reordenada por rank/valor). "Outros" e "Não informado" usam o
// tom neutro reservado, nunca uma cor da paleta.
const PALETTE = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
  "var(--series-7)",
  "var(--series-8)",
];
const COR_NEUTRA = "var(--text-muted)";

const FONTE_COR: Record<string, string> = {
  "Lei Paulo Gustavo": PALETTE[0],
  "Lei Aldir Blanc": PALETTE[1],
  "Política Nacional Aldir Blanc": PALETTE[2],
  "Programa ICMS Cultural e Patrimonial": PALETTE[5],
};

/** Cor por fonte, sem colidir com as cores fixas de FONTE_COR: percorre a
 * paleta pulando índices já usados (fixos ou já atribuídos a outra fonte
 * nesta mesma chamada), em vez de indexar pela posição no array — a posição
 * sozinha colide assim que o número de fontes cresce (ex: "Patrocínios"
 * caindo no mesmo índice que "Lei Paulo Gustavo"). */
function construirCoresFonte(nomes: string[]): Record<string, string> {
  const cores: Record<string, string> = {};
  const usados = new Set<number>();
  for (const nome of nomes) {
    const fixa = FONTE_COR[nome];
    if (fixa !== undefined) {
      cores[nome] = fixa;
      usados.add(PALETTE.indexOf(fixa));
    }
  }
  let proximo = 0;
  for (const nome of nomes) {
    if (cores[nome]) continue;
    let tentativas = 0;
    while (usados.has(proximo) && tentativas < PALETTE.length) {
      proximo = (proximo + 1) % PALETTE.length;
      tentativas++;
    }
    // mais fontes distintas do que cores na paleta: aceita repetir a partir
    // daqui em vez de travar (caso raro, categoria nova além da 8ª).
    cores[nome] = PALETTE[proximo];
    usados.add(proximo);
    proximo = (proximo + 1) % PALETTE.length;
  }
  return cores;
}

/** Agrupa categorias em ≤ max fatias + "Outros" — nunca gera uma 9ª cor. */
function construirFatias(
  itens: { rotulo: string; valor: number }[],
  max = 6
): PieSlice[] {
  const ordenado = [...itens].sort((a, b) => b.valor - a.valor);
  const principais = ordenado.slice(0, max);
  const resto = ordenado.slice(max);
  const somaResto = resto.reduce((s, i) => s + i.valor, 0);
  const fatias: PieSlice[] = principais.map((item, idx) => ({
    key: item.rotulo,
    label: item.rotulo,
    value: item.valor,
    color: PALETTE[idx % PALETTE.length],
  }));
  if (somaResto > 0) {
    fatias.push({ key: "__outros__", label: "Outros", value: somaResto, color: COR_NEUTRA });
  }
  return fatias;
}

/** As 12 regionais são um conjunto fixo e pequeno (não uma cauda longa como
 * município) — mostra todas, sem "Outros". Cor por número da regional (fixo),
 * não por tamanho do investimento, pra cada regional manter sempre a mesma
 * cor entre atualizações. Com 12 categorias e só 8 cores da paleta, a cor
 * repete a cada 8 — a legenda com o texto da regional ao lado garante que a
 * identidade nunca depende só da cor. */
function construirFatiasRegional(itens: { regional: string; valor: number }[]): PieSlice[] {
  const comNumero = itens
    .map((item) => ({ ...item, numero: parseInt(item.regional, 10) }))
    .filter((item) => !Number.isNaN(item.numero))
    .sort((a, b) => a.numero - b.numero);
  return comNumero.map((item) => ({
    key: item.regional,
    label: item.regional,
    value: item.valor,
    color: PALETTE[(item.numero - 1) % PALETTE.length],
  }));
}

/** Separa o balde "Não informado" pra virar legenda de cobertura, não fatia
 * dominante do gráfico — mostrar "71% não informado" como maior fatia da
 * pizza é ruim de ler e passa a impressão errada de que falta quase tudo. */
function separarNaoInformado(itens: { categoria: string; quantidade: number }[]) {
  const total = itens.reduce((s, i) => s + i.quantidade, 0);
  const naoInformado = itens.find((i) => i.categoria === "Não informado")?.quantidade ?? 0;
  const conhecidos = itens
    .filter((i) => i.categoria !== "Não informado")
    .map((i) => ({ rotulo: i.categoria, valor: i.quantidade }));
  return { conhecidos, total, totalConhecido: total - naoInformado };
}

export default async function Home() {
  const dashboard = await getDashboard();

  const municipioItems: BarItem[] = dashboard.municipios.map((m) => ({
    key: m.municipio,
    label: m.municipio,
    valueRaw: m.valor,
    color: "var(--series-1)",
    tooltip: `${m.municipio}: ${formatBRL(m.valor)}`,
  }));

  const coresFonte = construirCoresFonte(dashboard.valor_por_fonte.map((f) => f.fonte));
  const fonteSlices: PieSlice[] = dashboard.valor_por_fonte.map((f) => ({
    key: f.fonte,
    label: f.fonte,
    value: f.valor,
    color: coresFonte[f.fonte],
  }));

  const situacaoFatias = construirFatias(
    dashboard.registros_por_situacao.map((s) => ({ rotulo: s.situacao, valor: s.quantidade })),
    5
  );

  const tipoProponente = separarNaoInformado(dashboard.registros_por_tipo_proponente);
  const tipoProponenteFatias = construirFatias(
    tipoProponente.conhecidos.map((c) => ({
      rotulo: c.rotulo === "PF" ? "Pessoa física" : c.rotulo === "PJ" ? "Pessoa jurídica" : c.rotulo,
      valor: c.valor,
    }))
  );

  const prestacaoContas = separarNaoInformado(dashboard.registros_por_prestacao_contas);
  const prestacaoContasFatias = construirFatias(
    prestacaoContas.conhecidos.map((c) => ({ rotulo: c.rotulo, valor: c.valor }))
  );

  const raca = separarNaoInformado(dashboard.registros_por_raca);
  const racaFatias = construirFatias(raca.conhecidos.map((c) => ({ rotulo: c.rotulo, valor: c.valor })));

  const genero = separarNaoInformado(dashboard.registros_por_genero);
  const generoFatias = construirFatias(genero.conhecidos.map((c) => ({ rotulo: c.rotulo, valor: c.valor })));

  const cota = separarNaoInformado(dashboard.registros_por_cota);
  const cotaFatias = construirFatias(cota.conhecidos.map((c) => ({ rotulo: c.rotulo, valor: c.valor })));

  const acaoAfirmativa = separarNaoInformado(dashboard.registros_por_acao_afirmativa);
  const acaoAfirmativaFatias = construirFatias(
    acaoAfirmativa.conhecidos.map((c) => ({ rotulo: c.rotulo, valor: c.valor }))
  );

  const orientacaoSexual = separarNaoInformado(dashboard.registros_por_orientacao_sexual);
  const orientacaoSexualFatias = construirFatias(
    orientacaoSexual.conhecidos.map((c) => ({ rotulo: c.rotulo, valor: c.valor }))
  );

  const deficiencia = separarNaoInformado(dashboard.registros_por_deficiencia);
  const deficienciaFatias = construirFatias(
    deficiencia.conhecidos.map((c) => ({ rotulo: c.rotulo, valor: c.valor }))
  );

  const regionalFatias = construirFatiasRegional(dashboard.investimento_por_regional);
  const totalComRegional = dashboard.total_registros - dashboard.registros_sem_regional;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="border-b border-[var(--border-hairline)] pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Portal da Transparência — Secult PB
        </p>
        <div className="mt-3 text-5xl font-semibold text-[var(--text-primary)]">
          {formatBRLCompact(dashboard.total_investido)}
        </div>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          investidos em cultura no estado da Paraíba
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile label="Registros" value={formatNumber(dashboard.total_registros)} />
          <StatTile label="Municípios atendidos" value={formatNumber(dashboard.n_municipios)} />
          <StatTile label="Proponentes/beneficiários" value={formatNumber(dashboard.n_proponentes)} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Distribuição por categoria
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Como os {formatNumber(dashboard.total_registros)} registros se distribuem por fonte de
          recurso, situação, perfil do proponente e regional de cultura.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <PieChart
            title="Registros por fonte de recurso"
            slices={fonteSlices}
            valueLabel={(v) => formatBRLCompact(v)}
            centerLabel="investido"
          />
          <PieChart
            title="Registros por situação"
            slices={situacaoFatias}
            valueLabel={(v) => formatNumber(v)}
            centerLabel="registros"
          />
          <PieChart
            title="Tipo de proponente"
            slices={tipoProponenteFatias}
            valueLabel={(v) => formatNumber(v)}
            centerLabel="com esse dado"
            note={`Dado disponível em ${formatNumber(tipoProponente.totalConhecido)} de ${formatNumber(tipoProponente.total)} registros (${Math.round((tipoProponente.totalConhecido / tipoProponente.total) * 100)}%) — Aldir Blanc/PNAB não distingue pessoa física de jurídica na fonte. Distribuição abaixo considera só os registros com esse dado.`}
          />
          <PieChart
            title="Exige prestação de contas?"
            slices={prestacaoContasFatias}
            valueLabel={(v) => formatNumber(v)}
            centerLabel="com esse dado"
            note={`Só é possível confirmar esse dado nos registros já cruzados com a planilha de prestação de contas: ${formatNumber(prestacaoContas.totalConhecido)} de ${formatNumber(prestacaoContas.total)} (${Math.round((prestacaoContas.totalConhecido / prestacaoContas.total) * 100)}%). Distribuição abaixo considera só esses.`}
          />
          <PieChart
            title="Investimento por regional de cultura"
            slices={regionalFatias}
            valueLabel={(v) => formatBRLCompact(v)}
            centerLabel="investido"
            note={`Calculado a partir do município de ${formatNumber(totalComRegional)} de ${formatNumber(dashboard.total_registros)} registros (${Math.round((totalComRegional / dashboard.total_registros) * 100)}%) — o Programa ICMS Cultural e Patrimonial ainda não registra município por projeto.`}
          />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Perfil demográfico dos proponentes
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Dado autodeclarado, cruzado a partir das planilhas de inscrição da PNAB por CPF/CNPJ —
          disponível só pra quem casou com um documento válido, não pro total de registros.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <PieChart
            title="Raça/cor"
            slices={racaFatias}
            valueLabel={(v) => formatNumber(v)}
            centerLabel="com esse dado"
            note={`Dado disponível em ${formatNumber(raca.totalConhecido)} de ${formatNumber(raca.total)} registros (${Math.round((raca.totalConhecido / raca.total) * 100)}%).`}
          />
          <PieChart
            title="Gênero"
            slices={generoFatias}
            valueLabel={(v) => formatNumber(v)}
            centerLabel="com esse dado"
            note={`Dado disponível em ${formatNumber(genero.totalConhecido)} de ${formatNumber(genero.total)} registros (${Math.round((genero.totalConhecido / genero.total) * 100)}%).`}
          />
          <PieChart
            title="Cota"
            slices={cotaFatias}
            valueLabel={(v) => formatNumber(v)}
            centerLabel="com esse dado"
            note={`Dado disponível em ${formatNumber(cota.totalConhecido)} de ${formatNumber(cota.total)} registros (${Math.round((cota.totalConhecido / cota.total) * 100)}%).`}
          />
          <PieChart
            title="Ação afirmativa"
            slices={acaoAfirmativaFatias}
            valueLabel={(v) => formatNumber(v)}
            centerLabel="com esse dado"
            note={`Dado disponível em ${formatNumber(acaoAfirmativa.totalConhecido)} de ${formatNumber(acaoAfirmativa.total)} registros (${Math.round((acaoAfirmativa.totalConhecido / acaoAfirmativa.total) * 100)}%).`}
          />
          <PieChart
            title="Orientação sexual"
            slices={orientacaoSexualFatias}
            valueLabel={(v) => formatNumber(v)}
            centerLabel="com esse dado"
            note={`Dado disponível em ${formatNumber(orientacaoSexual.totalConhecido)} de ${formatNumber(orientacaoSexual.total)} registros (${Math.round((orientacaoSexual.totalConhecido / orientacaoSexual.total) * 100)}%) — só um dos editais cruzados pergunta isso.`}
          />
          <PieChart
            title="Pessoa com deficiência"
            slices={deficienciaFatias}
            valueLabel={(v) => formatNumber(v)}
            centerLabel="com esse dado"
            note={`Dado disponível em ${formatNumber(deficiencia.totalConhecido)} de ${formatNumber(deficiencia.total)} registros (${Math.round((deficiencia.totalConhecido / deficiencia.total) * 100)}%).`}
          />
        </div>
      </div>

      <div className="mt-10">
        <MunicipiosList items={municipioItems} />
      </div>

      <div className="mt-8">
        <Link
          href="/registros"
          className="text-sm font-medium text-[var(--series-1)] hover:underline"
        >
          Ver todos os registros individuais →
        </Link>
      </div>
    </div>
  );
}
