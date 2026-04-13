/**
 * @file index.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

/**
 * Configuration Validation Example
 * Demonstrates schema validation and Duck-typed object guarantees.
 */
import { createPluginSystem, definePlugin } from '@public/index';

// 1. Create a system injecting configurations globally across plugins
const system = createPluginSystem({
  lifecycles: ['onBoot'],
  config: {
    // We intentionally provide undefined to trigger validation failure
    'strict-feature': { apiKey: undefined } 
  }
});

// 2. Define a plugin with a strict configuration schema
const strictFeature = definePlugin({
  name: 'strict-feature',
  defaultConfig: { apiKey: 'default-key' },
  
  // configSchema can be a Joi schema, a Zod schema (.parse()), or a raw function
  configSchema: (cfg: any) => {
    if (!cfg.apiKey) throw new Error("apiKey strictly required! Cannot be null.");
  }
});

system.register(strictFeature);

async function start() {
  try {
    console.log("Attempting to boot system with invalid configuration...");
    // 3. system.init() merges configurations natively and halts gracefully when verification drops
    await system.init();
  } catch (err: any) {
    console.error("\n[XPlug Intercepted Schema Error]");
    console.error(err.message);
    console.log("\nPlugin initialization was safely aborted.");
  }
}
start();
