import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { BotaoCopiarEmail } from "@/components/BotaoCopiarEmail";
import { EMAIL_SUGESTOES } from "@/lib/contato";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal da Transparência — Secretaria de Cultura da Paraíba",
  description:
    "Consulta pública dos recursos da Lei Paulo Gustavo, da Política Nacional Aldir Blanc e do Programa ICMS Cultural e Patrimonial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* faixa vermelha e preta -- referencia as cores da bandeira da Paraíba, a pedido do Secretário */}
        <div className="flex h-1.5 w-full" aria-hidden="true">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-black" />
        </div>
        <header className="border-b border-[var(--border-hairline)] bg-[var(--surface-1)]">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex flex-col leading-tight">
              <span className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                Portal da Transparência
                <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Beta
                </span>
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                Secretaria de Cultura da Paraíba
              </span>
            </Link>
            <nav className="flex gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Painel
              </Link>
              <Link
                href="/registros"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Registros
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--border-hairline)] mt-12">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <div className="flex flex-wrap items-center gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-secult-governo-pb.png"
                alt="Secretaria de Estado da Cultura e Governo da Paraíba"
                className="h-10 w-auto"
              />
              <div className="ml-auto">
                <BotaoCopiarEmail email={EMAIL_SUGESTOES} />
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
