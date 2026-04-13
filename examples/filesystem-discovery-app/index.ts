/**
 * @file index.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

/**
 * Filesystem Discovery Example
 * Demonstrates how to recursively discover and index plugin modules via file paths.
 */
import * as path from 'path';
import { createPluginSystem } from '@public/index';
// loadFromDir is part of the discovery utility
import { loadFromDir } from '../../src/discovery/load-from-dir';

const system = createPluginSystem({ lifecycles: ['onBoot'] });

async function start() {
  const pluginDir = path.join(__dirname, 'plugins');
  
  console.log(`Scanning local folder ${pluginDir} dynamically...`);
  // 1. Recursively search default or named exports matching plugin boundaries
  await loadFromDir(pluginDir, system as any);
  
  // 2. Validating topologies dynamically
  await system.init();
  console.log("\nInitialized plugins found strictly from filesystem:", system.listInitializedPlugins());
  
  await system.runLifecycle('onBoot');
}

start();
