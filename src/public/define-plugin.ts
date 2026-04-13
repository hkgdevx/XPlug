/**
 * @file define-plugin.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { PluginDefinition } from '@core/types';

/**
 * A strongly-typed helper function for defining XPlug plugins.
 * @param plugin The plugin definition structure
 * @returns The strictly typed plugin definition
 //
 */
export function definePlugin<TConfig = any>(plugin: PluginDefinition<TConfig>): PluginDefinition<TConfig> {
  // In future we might apply default Zod schemas here if enabled.
  return plugin;
}
