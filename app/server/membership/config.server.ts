import { ConfigurablesService } from "~/modules/configurables/src/services/configurables.service";
import {
  defaultConfigurablesData,
  type TDefaultConfigurableData,
} from "~/modules/configurables/src/constants/configurables.default";

/**
 * Server-side accessor for the singleton app configurables, merged over the
 * in-code defaults. Owner-configurable loyalty economy values (points,
 * rewards catalog, tiers) are read from here so business logic stays driven
 * by the configurables module per RULES.md R11.
 */
export async function getServerConfig(): Promise<TDefaultConfigurableData> {
  try {
    const data = await ConfigurablesService.getData();
    return { ...defaultConfigurablesData, ...(data ?? {}) } as TDefaultConfigurableData;
  } catch {
    return defaultConfigurablesData;
  }
}

export function num(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
