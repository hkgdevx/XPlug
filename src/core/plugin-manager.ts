/**
 * @file plugin-manager.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { PluginDefinition } from './types';
import { ServiceRegistry } from './service-registry';
import { LifecycleRegistry } from './lifecycle-registry';
import { DependencyResolver } from './dependency-resolver';
import { ContextFactory } from './context-factory';
import { ConfigResolver } from './config-resolver';
import { DuplicatePluginError } from './errors';

export interface PluginManagerOptions {
  lifecycles: string[];
  logger?: any;
  config?: Record<string, any>;
}

export class PluginManager {
  private plugins = new Map<string, PluginDefinition>();
  private serviceRegistry: ServiceRegistry;
  private lifecycleRegistry: LifecycleRegistry;
  private contextFactory: ContextFactory;

  private logger: any;
  private globalConfig: Record<string, any>;

  private initialized = false;

  constructor(options: PluginManagerOptions) {
    this.logger = options.logger || console;
    this.globalConfig = options.config || {};

    this.serviceRegistry = new ServiceRegistry();
    this.lifecycleRegistry = new LifecycleRegistry(options.lifecycles);
    this.contextFactory = new ContextFactory(this.serviceRegistry, this.logger, (lifecycle, payload) =>
      this.runLifecycle(lifecycle, payload)
    );
  }

  public register(plugin: PluginDefinition): void {
    if (this.plugins.has(plugin.name)) {
      throw new DuplicatePluginError(plugin.name);
    }
    this.plugins.set(plugin.name, plugin);
  }

  public registerMany(plugins: PluginDefinition[]): void {
    for (const plugin of plugins) {
      this.register(plugin);
    }
  }

  public getDiagnostics() {
    return {
      initializedPlugins: this.listInitializedPlugins(),
      telemetry: this.lifecycleRegistry.getTelemetry()
    };
  }

  public async init(): Promise<void> {
    if (this.initialized) return;

    // Filter out disabled plugins securely via host override or intrinsic prop
    const activePlugins = Array.from(this.plugins.values()).filter(p => {
      const hostOverride = this.globalConfig[p.name] || {};
      if (hostOverride.enabled === false) return false;
      if (p.enabled === false) return false;
      return true;
    });

    // 1. Resolve Dependencies (Topological Sort)
    const sortedPlugins = DependencyResolver.sort(activePlugins);

    // 2. Initialize cross-lifecycle isolated states and build lifecycle hook registry
    for (const plugin of sortedPlugins) {
      // Execute strict config resolution & schema execution before load
      const mergedConfig = ConfigResolver.resolve(plugin, this.globalConfig[plugin.name]);
      this.contextFactory.setPluginConfig(plugin.name, mergedConfig);

      this.contextFactory.initializeState(plugin.name);
      this.lifecycleRegistry.registerPluginHooks(plugin);
    }

    // 3. Register Plugin Services in logical order
    for (const plugin of sortedPlugins) {
      if (plugin.services) {
        for (const [serviceName, serviceInstance] of Object.entries(plugin.services)) {
          // Store fully qualified to avoid cross-plugin clashes if needed,
          // but conventionally the plugin author specifies the name in the record.
          this.serviceRegistry.register(serviceName, serviceInstance, plugin.name);
        }
      }
    }

    this.initialized = true;
  }

  public listInitializedPlugins(): string[] {
    if (!this.initialized) return [];
    // Only return plugins that are actively enabled
    return Array.from(this.plugins.values())
      .filter(p => {
        const hostOverride = this.globalConfig[p.name] || {};
        if (hostOverride.enabled === false) return false;
        if (p.enabled === false) return false;
        return true;
      })
      .map(p => p.name);
  }

  public async runLifecycle(lifecycle: string, payload?: unknown): Promise<void> {
    if (!this.initialized) {
      throw new Error('Plugin manager is not initialized. Call init() first.');
    }

    // Pass down a factory callback that creates the Context specifically with this run's payload
    await this.lifecycleRegistry.runLifecycle(lifecycle, (pluginName: string) => {
      const plugin = this.plugins.get(pluginName)!;
      return this.contextFactory.buildContext(plugin, payload);
    });
  }

  public getService(name: string): any {
    return this.serviceRegistry.get(name);
  }

  public getContext(pluginName: string): any {
    if (!this.initialized) throw new Error('Not initialized');
    const plugin = this.plugins.get(pluginName);
    if (!plugin) return undefined;
    return this.contextFactory.buildContext(plugin);
  }

  public listPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  public getPlugin(name: string): PluginDefinition | undefined {
    return this.plugins.get(name);
  }
}
