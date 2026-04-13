/**
 * @file index.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

export * from '@core/types';
export * from '@core/errors';
export { PluginManager, PluginManagerOptions } from '@core/plugin-manager';
export { definePlugin } from './define-plugin';
export { createPluginSystem } from './create-plugin-system';
