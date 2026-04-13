/**
 * @file dependency-resolver.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { PluginDefinition } from './types';
import { DependencyError, CircularDependencyError } from './errors';

export class DependencyResolver {
  /**
   * Performs a topological sort of the provided plugins based on their dependencies.
   * @param plugins Array of plugin definitions.
   * @returns A sorted array of plugin definitions.
   * @throws DependencyError if a required dependency is missing.
   * @throws CircularDependencyError if a cycle is detected.
   */
  public static sort(plugins: PluginDefinition[]): PluginDefinition[] {
    const pluginMap = new Map<string, PluginDefinition>();
    for (const p of plugins) {
      pluginMap.set(p.name, p);
    }

    const sorted: PluginDefinition[] = [];
    const visited = new Set<string>();
    const processing = new Set<string>();

    const visit = (pluginName: string, path: string[]) => {
      if (processing.has(pluginName)) {
        throw new CircularDependencyError(pluginName, [...path, pluginName].join(' -> '));
      }
      if (visited.has(pluginName)) {
        return;
      }

      const plugin = pluginMap.get(pluginName);
      if (!plugin) {
        // This should theoretically not happen if the entry was verified before visit,
        // but included for safety.
        return;
      }

      processing.add(pluginName);
      path.push(pluginName);

      const allDeps = [...(plugin.dependencies || []), ...(plugin.optionalDependencies || [])];

      for (const dep of allDeps) {
        const isRequired = plugin.dependencies?.includes(dep);
        if (!pluginMap.has(dep)) {
          if (isRequired) {
            throw new DependencyError(pluginName, dep);
          }
          // Optional dependency is missing, just ignore
          continue;
        }
        // Proceed with dependency
        visit(dep, path);
      }

      path.pop();
      processing.delete(pluginName);
      visited.add(pluginName);
      sorted.push(plugin);
    };

    for (const p of plugins) {
      if (!visited.has(p.name)) {
        visit(p.name, []);
      }
    }

    return sorted;
  }
}
