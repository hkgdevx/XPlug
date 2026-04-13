/**
 * @file index.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import express from 'express';
import { createPluginSystem, definePlugin } from '@public/index';
import { mountMiddleware, mountRoutes } from '@express/index';

const app = express();

const system = createPluginSystem({ lifecycles: ['onBoot', 'onShutdown'] });

const helloPlugin = definePlugin({
  name: 'hello',
  routes: (ctx, router) => {
    router.get('/', (req, res) => {
      res.send(`Hello from XPlug version 1.0!`);
    });
  }
});

system.register(helloPlugin);

async function start() {
  await system.init();
  await mountMiddleware(app, system);
  await mountRoutes(app, system);

  const server = app.listen(3000, () => {
    console.log('App is listening cleanly on port 3000');
  });

  process.on('SIGINT', async () => {
    await system.runLifecycle('onShutdown');
    server.close();
    process.exit(0);
  });
}

start();
