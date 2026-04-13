/**
 * @file index.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

/**
 * Custom Lifecycle Example
 * Demonstrates defining and triggering domain-specific business events dynamically.
 */
import express from 'express';
import { createPluginSystem, definePlugin } from '@public/index';

// A simple express server
const app = express();
app.use(express.json());

// 1. Define custom non-startup lifecycles. We introduce 'onOrderCreated'.
const system = createPluginSystem({
  lifecycles: ['onBoot', 'onOrderCreated']
});

// 2. A hypothetical analytics plugin reacting to domain-specific lifecycles dynamically
const revenueMetrics = definePlugin({
  name: 'revenue-metrics',
  defaultConfig: { alertThreshold: 100 },
  configSchema: (cfg: { alertThreshold: number }) => {
    if (cfg.alertThreshold < 0) throw new Error("Threshold cannot be negative");
  },
  hooks: {
    // 3. Binds hooks against dynamic business-logic triggers natively
    'onOrderCreated': (ctx) => {
      // ctx.payload captures the dynamic order arguments seamlessly!
      const order = ctx.payload as { amount: number };
      console.log(`[Metrics] Received order value: $${order.amount}`);
      
      if (order.amount >= ctx.config.alertThreshold) {
         console.log(`[ALARM] High value order detected! Alerting CEO...`);
      }
    }
  }
});

system.register(revenueMetrics);

async function start() {
  await system.init();
  await system.runLifecycle('onBoot');

  // Let's create an endpoint that invokes our runtime lifecycle system
  app.post('/api/orders', async (req, res) => {
    const orderData = req.body;
    
    // Some persistence logic here...
    
    // 4. Broadcast lifecycle dynamically for installed plugins to consume
    await system.runLifecycle('onOrderCreated', orderData);
    
    res.json({ success: true, order: orderData });
  });

  app.listen(3002, () => console.log('Domain Event Express Test is alive on 3002'));
}

start();
