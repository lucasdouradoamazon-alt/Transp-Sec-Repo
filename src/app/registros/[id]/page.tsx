import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistros } from "@/lib/data";
import { Campo, Secao } from "@/components/CampoIdentificacao";
import { StatusIcon } from "@/components/StatusIcon";
import { BotaoDenuncia } from "@/components/BotaoDenuncia";
import { statusKind, statusColorVar } from "@/lib/status";
import { formatBRL, labelResultadoLink } from "@/lib/format";
import { LINK_OUVIDORIA_CULTURA } from "@/lib/contato";

export const dynamic = "force-static";

/** Planilha mistura link com texto livre (descrição, nome de arquivo) na
 * mesma coluna — só vira link clicável quando parece URL de verdade. */
function LinkOuTexto({ label, value }: { label: string; value: string }) {
  if (value.toLowerCase().startsWith("http")) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-[var(--series-1)] hover:underline"
      >
        {label} ↗
      </a>
    );
  }
  return <Campo label={label} value={value} />;
}

export async function generateStaticParams() {
  const registros = await getRegistros();
  return registros.map((r) => ({ id: r.id }));
}

export default async function RegistroDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const registros = await getRegistros();
  const registro = registros.find((r) => r.id === id);

  if (!registro) {
    notFound();
  }

  const kind = registro.situacao ? statusKind(registro.situacao) : "neutral";
  const isLpg = registro.tipo_iniciativa === "projeto_selecionado";

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/registros"
        className="text-sm font-medium text-[var(--series-1)] hover:underline"
      >
        ← Voltar para registros
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {registro.fonte}
            {registro.is_exemplo && " · registro de demonstração"}
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
            {registro.nome_proponente ?? "Proponente não identificado"}
          </h1>
          {registro.titulo && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {registro.titulo}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-2xl font-semibold tabular text-[var(--text-primary)]">
            {formatBRL(registro.valor)}
          </div>
          {registro.situacao && (
            <div className="flex items-center text-sm text-[var(--text-secondary)]">
              <StatusIcon kind={kind} />
              {registro.situacao}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <BotaoDenuncia href={LINK_OUVIDORIA_CULTURA} />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Secao title="Identificação">
          <Campo label="Fonte de recurso" value={registro.fonte} />
          <Campo label="Edital" value={registro.edital_numero} />
          {registro.edital_nome && (
            <Campo label="Nome do edital" value={registro.edital_nome} />
          )}
          {registro.edital_comissao && (
            <Campo label="Comissão" value={registro.edital_comissao} />
          )}
          <Campo label="Processo" value={registro.processo} />
          <Campo label="Ano do repasse" value={registro.ano_repasse} />
          <Campo label="Vigência" value={registro.vigencia} />
          <Campo label="Município" value={registro.municipio} />
          {registro.regional && (
            <Campo label="Regional" value={registro.regional} />
          )}
          <Campo
            label="Tipo de proponente"
            value={
              registro.tipo_proponente === "PF"
                ? "Pessoa física"
                : registro.tipo_proponente === "PJ"
                  ? "Pessoa jurídica"
                  : null
            }
          />
          <Campo label="Documento (mascarado)" value={registro.documento_mascarado} />
          {isLpg && (
            <>
              <Campo label="Categoria" value={registro.categoria_codigo} />
              <Campo label="Artigo" value={registro.artigo} />
              <Campo label="Inciso" value={registro.inciso} />
            </>
          )}
        </Secao>

        {registro.projeto_resumo && (
          <Secao title="Resumo do projeto">
            <div className="col-span-2 sm:col-span-3">
              <p className="text-sm text-[var(--text-secondary)]">{registro.projeto_resumo}</p>
            </div>
          </Secao>
        )}

        <Secao title="Perfil do proponente">
          <Campo label="Raça/cor" value={registro.proponente_raca} />
          <Campo label="Gênero" value={registro.proponente_genero} />
          <Campo label="Data de nascimento" value={registro.proponente_nascimento} />
          <Campo label="Cota" value={registro.proponente_cota} />
          <Campo label="Ação afirmativa" value={registro.proponente_acaoafirmativa} />
          <Campo label="Pessoa com deficiência" value={registro.proponente_deficiencia} />
        </Secao>

        <Secao title="Execução financeira">
          <Campo label="Empenho" value={registro.empenho} />
          <Campo label="Liquidação" value={registro.liquidacao} />
          <Campo label="Pagamento" value={registro.pagamento} />
          {registro.valor_captado !== null && (
            <Campo label="Valor captado" value={formatBRL(registro.valor_captado)} />
          )}
          {registro.captacao && <Campo label="Captação" value={registro.captacao} />}
        </Secao>

        {registro.patrocinadores && registro.patrocinadores.length > 0 && (
          <Secao title="Patrocinadoras (renúncia fiscal)">
            <div className="col-span-2 flex flex-col gap-2 sm:col-span-3">
              {registro.patrocinadores.map((p, idx) => (
                <div
                  key={`${p.nome}-${idx}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-[var(--text-secondary)]">{p.nome}</span>
                  {p.valor !== null && (
                    <span className="tabular shrink-0 text-[var(--text-primary)]">
                      {formatBRL(p.valor)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Secao>
        )}

        <Secao title="Prestação de contas">
          <Campo label="Exige prestação de contas?" value={registro.exige_prestacao_contas} />
          <Campo label="Prestou contas?" value={registro.prestou_contas} />
          <Campo label="Análise" value={registro.analise_prestacao_contas} />
          <Campo label="Aprovação" value={registro.prestacao_aprovacao} />
          <Campo label="Tomada de contas" value={registro.prestacao_tomadadecontas} />
          {registro.observacao && (
            <Campo label="Observação" value={registro.observacao} />
          )}
        </Secao>

        <Secao title="Atesto da execução">
          <Campo label="Servidor responsável" value={registro.atesto_nome_servidor} />
          <Campo label="Matrícula" value={registro.atesto_matricula} />
          <Campo label="Data/hora do atesto" value={registro.atesto_datahora} />
        </Secao>

        {registro.comprovantes_logomarca && registro.comprovantes_logomarca.length > 0 && (
          <Secao title="Comprovação de logomarca">
            <div className="col-span-2 grid grid-cols-2 gap-3 sm:col-span-3 sm:grid-cols-4">
              {registro.comprovantes_logomarca.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt="Comprovação de logomarca"
                  className="aspect-square w-full rounded border border-[var(--border-hairline)] object-cover"
                />
              ))}
            </div>
          </Secao>
        )}

        <Secao title="Resultados do projeto">
          {registro.resultado ? (
            <div className="col-span-2 flex flex-col gap-3 sm:col-span-3">
              {registro.resultado.links.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[var(--series-1)] hover:underline"
                >
                  {labelResultadoLink(url)} ↗
                </a>
              ))}
              {registro.resultado.rede_social && (
                <LinkOuTexto label="Rede social" value={registro.resultado.rede_social} />
              )}
              {registro.resultado.relatorio && (
                <a
                  href={registro.resultado.relatorio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[var(--series-1)] hover:underline"
                >
                  Relatório ↗
                </a>
              )}
              {registro.resultado.video && (
                registro.resultado.video_thumbnail ? (
                  <a
                    href={registro.resultado.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-40 overflow-hidden rounded border border-[var(--border-hairline)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={registro.resultado.video_thumbnail}
                      alt="Miniatura do vídeo"
                      className="aspect-video w-full object-cover"
                    />
                  </a>
                ) : (
                  <LinkOuTexto label="Vídeo" value={registro.resultado.video} />
                )
              )}
              {registro.resultado.foto && (
                <LinkOuTexto label="Foto" value={registro.resultado.foto} />
              )}
              {registro.resultado.imprensa && (
                <LinkOuTexto label="Imprensa" value={registro.resultado.imprensa} />
              )}
            </div>
          ) : (
            <div className="col-span-2 sm:col-span-3">
              <p className="text-xs text-[var(--text-muted)]">
                Nenhum material de resultado (fotos, vídeos ou relatório)
                enviado até o momento.
              </p>
            </div>
          )}
        </Secao>
      </div>
    </div>
  );
}
