/**
 * @file mount-routes.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { Application, Router } from 'express';
import { PluginManager } from '@core/plugin-manager';
import { PluginContext } from '@core/types';
import './types';

export async function mountRoutes(app: Application, manager: PluginManager): Promise<void> {
  const pluginNames = manager.listPlugins();

  for (const name of pluginNames) {
    const plugin = manager.getPlugin(name);
    if (!plugin || !plugin.routes) continue;

    const ctx = manager.getContext(name) as PluginContext;
    const router = Router();

    // Invoke the plugin's route factory
    await plugin.routes(ctx, router);

    // Default base path generation fallback
    const basePath = plugin.routeBasePath ?? `/${plugin.name.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}`;

    app.use(basePath, router);
  }
}
