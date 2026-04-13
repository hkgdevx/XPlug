/**
 * @file context-factory.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { PluginContext, PluginDefinition } from './types';
import { ServiceRegistry } from './service-registry';

export class ContextFactory {
  // We keep a state Map per plugin name so it persists across hooks
  private pluginStates = new Map<string, Map<string, unknown>>();
  // Track validated configs
  private resolvedConfigs = new Map<string, Record<string, any>>();

  constructor(
    private serviceRegistry: ServiceRegistry,
    private logger: any,
    private emitFn: (lifecycle: string, payload?: unknown) => Promise<void>
  ) {}

  public setPluginConfig(pluginName: string, config: Record<string, any>): void {
    this.resolvedConfigs.set(pluginName, config);
  }

  /**
   * Initializes the cross-lifecycle state map for a given plugin.
   */
  public initializeState(pluginName: string): void {
    if (!this.pluginStates.has(pluginName)) {
      this.pluginStates.set(pluginName, new Map<string, unknown>());
    }
  }

  /**
   * Builds the isolated runtime context for a specific plugin and lifecycle run.
   */
  public buildContext(plugin: PluginDefinition, payload?: unknown): PluginContext {
    const config = this.resolvedConfigs.get(plugin.name) || {};

    // Evaluate host configuration or default capabilities
    const capabilities = config._capabilities || plugin.capabilities || ['emit', 'logger', 'services'];

    const canEmit = capabilities.includes('emit');
    const canLog = capabilities.includes('logger');

    return {
      plugin: {
        name: plugin.name,
        version: plugin.version
      },
      logger: canLog
        ? this.logger
        : { log: () => {}, debug: () => {}, error: () => {}, info: () => {}, warn: () => {} },
      config,
      services: this.serviceRegistry,
      payload,
      state: this.pluginStates.get(plugin.name)!,
      emit: async (lifecycle: string, emitPayload?: unknown) => {
        if (!canEmit)
          throw new Error(`Plugin '${plugin.name}' is sandboxed and restricted from emitting further lifecycles.`);
        return this.emitFn(lifecycle, emitPayload);
      }
    };
  }
}
