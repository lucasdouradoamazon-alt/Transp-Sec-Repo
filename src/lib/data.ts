import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Dashboard, Registro } from "./types";

const dataDir = path.join(process.cwd(), "public", "data");

export async function getDashboard(): Promise<Dashboard> {
  const raw = await readFile(path.join(dataDir, "dashboard.json"), "utf-8");
  return JSON.parse(raw) as Dashboard;
}

export async function getRegistros(): Promise<Registro[]> {
  const raw = await readFile(path.join(dataDir, "registros.json"), "utf-8");
  return JSON.parse(raw) as Registro[];
}
