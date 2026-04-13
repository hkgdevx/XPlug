/**
 * @file index.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

/**
 * Plugin Dependencies Example
 * Demonstrates how XPlug topologically sorts plugins dynamically.
 */
import { createPluginSystem, definePlugin } from '@public/index';

// 1. Initialize the root Plugin System with allowed lifecycles
const system = createPluginSystem({ lifecycles: ['onBoot'] });

// 2. Define a generic Database plugin
// It provides a 'connect' service that other plugins can consume.
const databasePlugin = definePlugin({
  name: 'database',
  services: {
    connect: async () => { console.log('DB Connected!'); return true; }
  },
  hooks: {
    'onBoot': () => console.log('[Database] Booted strictly before Auth!')
  }
});

// 3. Define an Auth plugin that explicitly requires the Database plugin
const authPlugin = definePlugin({
  name: 'auth',
  dependencies: ['database'], // This ensures Auth loads AFTER Database
  hooks: {
    'onBoot': (ctx) => {
       // We can safely consume the database service here because of the topological sorting
       const dbConnect = ctx.services.getService('database.connect');
       if (dbConnect) console.log('[Auth] Successfully verified DB connect service was ready! Proceeding.');
    }
  }
});

// 4. Register out of order!
// Even though we register Auth first, the Engine detects the dependency and sorts DB first.
system.register(authPlugin); 
system.register(databasePlugin);

async function start() {
   // 5. Initialize resolves the topology and validates requirements
   await system.init();
   // 6. Run the synchronized boot logic
   await system.runLifecycle('onBoot');
   console.log("Dependency flow proven seamlessly!");
}
start();
