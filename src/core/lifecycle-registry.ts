/**
 * @file lifecycle-registry.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { PluginDefinition, PluginContext, PluginHook, PluginHookObject } from './types';

export class LifecycleRegistry {
  private allowedLifecycles: Set<string>;
  private hooks = new Map<string, Array<{ pluginName: string; hooks: PluginHookObject[] }>>();
  private telemetry: Array<{ pluginName: string; lifecycle: string; duration: number }> = [];

  constructor(lifecycles: string[]) {
    this.allowedLifecycles = new Set(lifecycles);
    for (const name of lifecycles) {
      this.hooks.set(name, []);
    }
  }

  public getTelemetry() {
    return this.telemetry;
  }

  public registerPluginHooks(plugin: PluginDefinition): void {
    if (!plugin.hooks) return;

    for (const [lifecycle, pluginHooks] of Object.entries(plugin.hooks)) {
      if (!this.allowedLifecycles.has(lifecycle)) {
        throw new Error(`Plugin '${plugin.name}' attempted to hook into unknown lifecycle '${lifecycle}'.`);
      }

      const hooksArray = Array.isArray(pluginHooks) ? pluginHooks : [pluginHooks];

      const normalizedHooks: PluginHookObject[] = hooksArray.map(h => {
        if (typeof h === 'function') return { handler: h, priority: 0 };
        return { handler: h.handler, priority: h.priority ?? 0 };
      });

      // Tie-break sorting internally within the topological boundary
      normalizedHooks.sort((a, b) => b.priority! - a.priority!);

      this.hooks.get(lifecycle)!.push({
        pluginName: plugin.name,
        hooks: normalizedHooks
      });
    }
  }

  /**
   * Runs the hooks for a specific lifecycle in deterministic order.
   * Awaits asynchronous hooks before proceeding.
   * @param lifecycle The name of the lifecycle to trigger
   * @param contextBuilder A function that returns the context for a given plugin
   * @throws Error if the lifecycle is unknown.
   */
  public async runLifecycle(lifecycle: string, contextBuilder: (pluginName: string) => PluginContext): Promise<void> {
    if (!this.allowedLifecycles.has(lifecycle)) {
      throw new Error(`Cannot run unknown lifecycle '${lifecycle}'.`);
    }

    const lifecycleHooks = this.hooks.get(lifecycle);
    if (!lifecycleHooks) return;

    for (const executionRecord of lifecycleHooks) {
      // Lazy load context specifically for this execution
      const ctx = contextBuilder(executionRecord.pluginName);

      for (const hook of executionRecord.hooks) {
        const start = Date.now();
        await hook.handler(ctx); // Awaits promise if async, safely proceeds if sync
        const duration = Date.now() - start;

        this.telemetry.push({ pluginName: executionRecord.pluginName, lifecycle, duration });

        if (ctx.logger && typeof ctx.logger.debug === 'function') {
          ctx.logger.debug(
            `[XPlug] Plugin '${executionRecord.pluginName}' executed '${lifecycle}' (priority: ${hook.priority}) in ${duration}ms`
          );
        }
      }
    }
  }
}
