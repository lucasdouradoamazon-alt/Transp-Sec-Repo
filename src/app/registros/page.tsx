import { getRegistros } from "@/lib/data";
import { RegistrosTable } from "@/components/RegistrosTable";

export const dynamic = "force-static";

export default async function RegistrosPage() {
  const registros = await getRegistros();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Registros individuais
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Projetos selecionados (Lei Paulo Gustavo) e beneficiários pagos (Lei
          Aldir Blanc). CPF/CNPJ mascarado conforme LGPD.
        </p>
      </div>
      <RegistrosTable registros={registros} />
    </div>
  );
}
