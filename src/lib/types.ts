export type Registro = {
  id: string;
  fonte: string;
  tipo_iniciativa:
    | "projeto_selecionado"
    | "beneficiario_renda_emergencial"
    | "projeto_icms_cultural";
  edital_numero: string | null;
  edital_nome: string | null;
  edital_comissao: string | null;
  aba_origem: string | null;
  categoria_codigo: string | null;
  artigo: string | null;
  inciso: string | null;
  tipo_proponente: "PF" | "PJ" | null;
  nome_proponente: string | null;
  documento_mascarado: string | null;
  /** SHA-256 dos dígitos do CPF/CNPJ (sem formatação) — usado só pra busca por número completo, nunca exibido. */
  documento_hash: string | null;
  municipio: string | null;
  regional: string | null;
  titulo: string | null;
  valor: number;
  situacao: string | null;
  vigencia: string | null;
  ano_repasse: string | null;
  processo: string | null;
  exige_prestacao_contas: string | null;
  prestou_contas: string | null;
  analise_prestacao_contas: string | null;
  prestacao_aprovacao: string | null;
  prestacao_tomadadecontas: string | null;
  empenho: string | null;
  liquidacao: string | null;
  pagamento: string | null;
  observacao: string | null;
  resultado: Resultado | null;
  projeto_resumo: string | null;
  proponente_raca: string | null;
  proponente_genero: string | null;
  proponente_nascimento: string | null;
  proponente_cota: string | null;
  proponente_acaoafirmativa: string | null;
  proponente_orientacao_sexual: string | null;
  proponente_deficiencia: string | null;
  atesto_nome_servidor: string | null;
  atesto_matricula: string | null;
  atesto_datahora: string | null;
  comprovantes_logomarca: string[] | null;
  /** Campos exclusivos do Programa ICMS Cultural e Patrimonial (renúncia fiscal). */
  valor_captado: number | null;
  captacao: string | null;
  patrocinadores: { nome: string; valor: number | null }[] | null;
  /** true apenas nos 2 registros ilustrativos de demonstração — nunca em dado real. */
  is_exemplo?: boolean;
};

export type Resultado = {
  links: string[];
  rede_social: string | null;
  relatorio: string | null;
  video: string | null;
  foto: string | null;
  imprensa: string | null;
};

export type TopMunicipio = { municipio: string; valor: number };
export type ValorPorFonte = { fonte: string; valor: number };
export type RegistroPorSituacao = {
  situacao: string;
  quantidade: number;
  valor: number;
};
export type PorCategoria = { categoria: string; quantidade: number };

export type Dashboard = {
  total_investido: number;
  total_registros: number;
  n_municipios: number;
  n_proponentes: number;
  /** todos os municípios com valor investido, ordenados desc — o front-end decide quanto mostrar */
  municipios: TopMunicipio[];
  valor_por_fonte: ValorPorFonte[];
  registros_por_situacao: RegistroPorSituacao[];
  registros_por_tipo_proponente: PorCategoria[];
  registros_por_prestacao_contas: PorCategoria[];
  registros_por_raca: PorCategoria[];
  registros_por_genero: PorCategoria[];
  registros_por_cota: PorCategoria[];
  registros_por_acao_afirmativa: PorCategoria[];
  registros_por_orientacao_sexual: PorCategoria[];
  registros_por_deficiencia: PorCategoria[];
  investimento_por_regional: { regional: string; valor: number }[];
  registros_sem_regional: number;
};
