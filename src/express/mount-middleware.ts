/**
 * @file mount-middleware.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { Application } from 'express';
import { PluginManager } from '@core/plugin-manager';
import { PluginContext } from '@core/types';
import './types'; // Module augmentation

export async function mountMiddleware(app: Application, manager: PluginManager): Promise<void> {
  const pluginNames = manager.listPlugins();

  for (const name of pluginNames) {
    const plugin = manager.getPlugin(name);
    if (!plugin || !plugin.middleware) continue;

    const ctx = manager.getContext(name) as PluginContext;
    const middlewares = Array.isArray(plugin.middleware) ? plugin.middleware : [plugin.middleware];

    for (const mw of middlewares) {
      const handler = mw.handler(ctx);
      if (mw.path) {
        app.use(mw.path, handler);
      } else {
        app.use(handler);
      }
    }
  }
}
