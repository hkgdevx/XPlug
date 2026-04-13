/**
 * @file dashboard.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { Router } from 'express';
import { PluginManager } from '@core/plugin-manager';

/**
 * Returns an Express Router serving real-time plugin diagnostics.
 * @param manager The initialized XPlug PluginManager
 */
export function expressPluginDashboard(manager: PluginManager): Router {
  const router = Router();

  router.get('/diagnostics', (req, res) => {
    try {
      const data = manager.getDiagnostics();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}
