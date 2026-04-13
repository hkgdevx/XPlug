import express from 'express';
import request from 'supertest';
import { createPluginSystem, definePlugin } from '@public/index';
import { mountMiddleware, mountRoutes } from '@express/index';

import { Request, Response, NextFunction, Router } from 'express';
import { PluginContext } from '@core/types';

describe('Express Adapter Integration', () => {
  it('should securely mount plugin routes and apply topological middleware', async () => {
    const app = express();
    const system = createPluginSystem({ lifecycles: [] });

    // A fake auth plugin that requires custom state
    const authPlugin = definePlugin({
      name: 'auth',
      middleware: {
        handler: (ctx: PluginContext) => (req: any, res: Response, next: NextFunction) => {
          req.user = 'test-user';
          next();
        }
      }
    });

    // A feature plugin that REQUIRES 'auth', meaning it mounts its routes AFTER auth middleware is registered
    const featurePlugin = definePlugin({
      name: 'billing',
      dependencies: ['auth'],
      routeBasePath: '/api/billing',
      routes: async (ctx: PluginContext, router: Router) => {
        router.get('/status', (req: any, res: Response) => {
          res.json({ active: true, user: req.user });
        });
      }
    });

    system.register(featurePlugin);
    system.register(authPlugin);

    await system.init();

    await mountMiddleware(app, system);
    await mountRoutes(app, system);

    const res = await request(app).get('/api/billing/status');
    expect(res.status).toBe(200);
    // Evaluates true only if 'auth' executed middleware injection before routes bounds hit
    expect(res.body).toEqual({ active: true, user: 'test-user' });
  });
});
