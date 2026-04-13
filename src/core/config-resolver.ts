/**
 * @file config-resolver.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { PluginDefinition } from './types';
import { ConfigValidationError } from './errors';

export class ConfigResolver {
  /**
   * Merges the plugin's default configuration with overrides provided by the host.
   * If the plugin specifies a configSchema, it performs structured execution to ensure validation passes.
   *
   * @param plugin The target definition
   * @param hostOverride Host-level override params specifically for this plugin
   * @returns The fully merged and validated configuration object
   */
  public static resolve(plugin: PluginDefinition, hostOverride: Record<string, any> = {}): Record<string, any> {
    const merged = { ...((plugin.defaultConfig as object) || {}), ...hostOverride };
    const schema = plugin.configSchema as any;

    if (schema) {
      try {
        if (typeof schema === 'function') {
          // Native function throws if invalid, or returns structured boolean
          const res = schema(merged);
          if (res === false) throw new Error('Validation function returned false');
        } else if (typeof schema.parse === 'function') {
          // Zod duck-typing
          schema.parse(merged);
        } else if (typeof schema.validate === 'function') {
          // Joi duck-typing
          const result = schema.validate(merged);
          if (result && result.error) throw result.error;
        }
      } catch (err: any) {
        throw new ConfigValidationError(plugin.name, err.message || 'Validation failed');
      }
    }

    return merged;
  }
}
