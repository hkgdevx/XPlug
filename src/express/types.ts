/**
 * @file types.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { PluginContext } from '@core/types';

/**
 * A middleware factory receives the plugin context and returns an Express handler.
 */
export type PluginMiddlewareConfig = {
  path?: string;
  handler: (ctx: PluginContext) => (req: Request, res: Response, next: NextFunction) => void;
};

/**
 * A route factory receives the plugin context and an Express Router to mount handlers onto.
 */
export type PluginRouteFactory = (ctx: PluginContext, router: Router) => void | Promise<void>;

// Extend the core PluginDefinition explicitly for Express
declare module '@core/types' {
  interface PluginDefinition<TConfig = any> {
    middleware?: PluginMiddlewareConfig | PluginMiddlewareConfig[];
    routes?: PluginRouteFactory;
    routeBasePath?: string;
  }
}
