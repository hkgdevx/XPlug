/**
 * @file index.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

/**
 * Diagnostics & Analytics Dashboard Example
 * Demonstrates routing telemetry dynamically securely onto Express.
 */
import express from 'express';
import { createPluginSystem, definePlugin } from '@public/index';
// Dashboard binds telemetry tracking naturally!
import { expressPluginDashboard } from '../../src/express/dashboard';

const app = express();
// 1. App boundaries inject Express seamlessly to context engines
const system = createPluginSystem({ app, lifecycles: ['onBoot'] });

// 2. We simulate a heavy 300ms plugin to see diagnostics record its footprint in the Dashboard JSON later
system.register(definePlugin({
  name: 'slow-plugin',
  hooks: { 'onBoot': async () => new Promise(r => setTimeout(r, 300)) }
}));

async function start() {
  await system.init();
  // 3. Executing lifecycles records time calculations across the node
  await system.runLifecycle('onBoot');
  
  // 4. Mounting dashboard locally allows observability over telemetry graphs
  app.use('/dashboard', expressPluginDashboard(system as any));
  const server = app.listen(3003, () => {
    console.log('Dashboard Diagnostics active at http://localhost:3003/dashboard/diagnostics');
    console.log('Use CTRL+C to detach server example.');
  });
}

start();
