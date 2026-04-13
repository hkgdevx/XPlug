/**
 * @file index.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import express from 'express';
import { createPluginSystem, definePlugin } from '../../src/public/index';
import { expressPluginDashboard } from '../../src/express/dashboard';

// Initialize the core Express app
const app = express();
app.use(express.json());

// ============================================================================
// 1. Core Instantiation
// ============================================================================
const system = createPluginSystem({ 
 app, 
 lifecycles: ['onDatabaseConnected', 'onBoot', 'onUserPurchase'],
 config: {
 // Global parameters intelligently override individual plugin defaults
 'payment-gateway': { apiKey: 'live_pk_1234' }
 }
});

// ============================================================================
// 2. Database Plugin (Exposes a Service)
// ============================================================================
const databasePlugin = definePlugin({
 name: 'database',
 services: {
 getUser: async (id: number) => ({ id, name: "Harikrishnan" })
 },
 hooks: {
 'onDatabaseConnected': () => console.log(' [Database] Drivers loaded and services exported.')
 }
});

// ============================================================================
// 3. Payment Gateway Plugin (Dependencies, Topologies, Schemas, & Routes)
// ============================================================================
const paymentPlugin = definePlugin({
 name: 'payment-gateway',
 dependencies: ['database'], // Forces Payments to evaluate strictly AFTER Database
 defaultConfig: { apiKey: 'test_pk_000', currency: 'USD' },
 
 // Validates config natively, intercepting crashes gracefully
 configSchema: (cfg) => {
 if (!cfg.apiKey.startsWith('live_')) throw new Error("Only Live API Keys permitted!");
 },

 hooks: {
 'onBoot': (ctx) => {
 // Demonstrates safe service consumption resulting from topological constraints
 const userSrc = ctx.services.getService('database.getUser');
 if (userSrc) console.log(` [Payment] Hooked up Database dynamically!`);
 }
 },

 routeBasePath: '/payments',
 routes: [
 {
 method: 'post',
 path: '/charge',
 handler: async (ctx, req, res) => {
 // Broadcast a custom Domain Event safely into the Plugin Ecosystem
 await ctx.emit('onUserPurchase', { amount: req.body.amount || 100 });
 res.json({ success: true, processedVia: ctx.config.apiKey });
 }
 }
 ]
});

// ============================================================================
// 4. Analytics Plugin (Sandboxing Constraints & Priority Hooking)
// ============================================================================
const untrustedAnalytics = definePlugin({
 name: 'untrusted-analytics',
 capabilities: ['logger'], // Drops 'emit'. This plugin physically cannot broadcast events natively
 hooks: {
 'onUserPurchase': {
 priority: 10, // Explicitly guarantees this hook executes before any identical listener
 handler: (ctx) => {
 const payload = ctx.payload as { amount: number };
 ctx.logger.info(`[Analytics Sandbox] Tracked raw purchase: $${payload.amount}`);
 }
 }
 }
});

// ============================================================================
// 5. Registration
// ============================================================================
// We blindly register the plugins inverted... XPlug determines Topology natively!
system.register(paymentPlugin);
system.register(untrustedAnalytics);
system.register(databasePlugin);


async function bootEcosystem() {
 // 6. Validate topology cycles and duck-typed configuration limits
 await system.init();

 // 7. Fire mapped lifecycles synchronously
 await system.runLifecycle('onDatabaseConnected');
 await system.runLifecycle('onBoot');
 
 // 8. Map plugin Routers and Middlewares statically onto Express
 await system.mountMiddleware();
 await system.mountRoutes();
 
 // 9. Integrate dynamic diagnostics
 app.use('/admin/diagnostics', expressPluginDashboard(system as any));

 // 10. Listen
 app.listen(3005, () => {
 console.log('\n E-Commerce Ecosystem Booted Successfully on 3005!');
 console.log(' - Test Checkout: POST http://localhost:3005/payments/charge { "amount": 99 }');
 console.log(' - Test Dashboard: GET http://localhost:3005/admin/diagnostics\n');
 });
}

bootEcosystem();
