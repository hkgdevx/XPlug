/**
 * @file create-plugin-system.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { PluginManager, PluginManagerOptions } from '@core/plugin-manager';

/**
 * Creates and returns a new strictly-typed PluginManager instance.
 * @param options PluginManager configuration including allowed lifecycles
 * @returns The PluginManager engine
 */
export function createPluginSystem(options: PluginManagerOptions): PluginManager {
  return new PluginManager(options);
}
