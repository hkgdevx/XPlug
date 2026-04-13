/**
 * @file load-from-dir.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import * as fs from 'fs';
import * as path from 'path';
import { PluginManager } from '@core/plugin-manager';
import { PluginDefinition } from '@core/types';

/**
 * Searches a specified directory flatly for javascript/typescript modules
 * and loads their default or named "plugin" exports onto the PluginManager.
 *
 * @param directoryPath Absolute path to the folder containing plugins
 * @param manager The XPlug PluginManager instance
 */
export async function loadFromDir(directoryPath: string, manager: PluginManager): Promise<void> {
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`Discovery directory not found: ${directoryPath}`);
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    let fullPath = path.join(directoryPath, entry.name);

    // We try to import .js or .ts files, or folders with index
    if (entry.isDirectory() || entry.name.match(/\.(js|ts)$/)) {
      try {
        const module = await import(fullPath);

        let pluginDef: PluginDefinition | undefined;

        if (module.default && module.default.name) {
          pluginDef = module.default;
        } else if (module.plugin && module.plugin.name) {
          pluginDef = module.plugin;
        }

        if (pluginDef) {
          manager.register(pluginDef);
        }
      } catch (err) {
        throw new Error(`Failed to load plugin bundle at '${fullPath}':\n${(err as Error).message}`);
      }
    }
  }
}
