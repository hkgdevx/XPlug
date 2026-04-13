/**
 * @file types.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

export interface PluginDefinition<TConfig = any> {
  name: string;
  version?: string;
  description?: string;
  enabled?: boolean;
  capabilities?: ('emit' | 'logger' | 'services')[];
  dependencies?: string[];
  optionalDependencies?: string[];
  defaultConfig?: TConfig;
  configSchema?: unknown;
  hooks?: Record<string, PluginHook | PluginHook[]>;
  services?: Record<string, any>;
}

export type PluginHookFn = (ctx: PluginContext) => void | Promise<void>;

export interface PluginHookObject {
  handler: PluginHookFn;
  priority?: number;
}

export type PluginHook = PluginHookFn | PluginHookObject;

export interface PluginContext {
  plugin: { name: string; version?: string };
  logger: any; // Using any for MVP; can be refined later
  config: Record<string, any>;
  services: any; // Type for ServiceRegistry
  payload?: unknown;
  state: Map<string, unknown>;
  emit: (lifecycle: string, payload?: unknown) => Promise<void>;
  // Omit Express app for strict zero-framework core. Will extend in Phase 2
}
