"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_manager_1 = require("@core/plugin-manager");
const errors_1 = require("@core/errors");
describe('PluginManager', () => {
    it('should register and retrieve plugins', () => {
        const manager = new plugin_manager_1.PluginManager({ lifecycles: [] });
        manager.register({ name: 'test' });
        expect(manager.listPlugins()).toEqual(['test']);
        expect(manager.getPlugin('test')).toBeDefined();
    });
    it('should throw on duplicate plugin name', () => {
        const manager = new plugin_manager_1.PluginManager({ lifecycles: [] });
        manager.register({ name: 'dup' });
        expect(() => manager.register({ name: 'dup' })).toThrow(errors_1.DuplicatePluginError);
    });
    it('should successfully orchestrate init and runLifecycle', async () => {
        const manager = new plugin_manager_1.PluginManager({
            lifecycles: ['onBoot'],
            config: { 'test': { foo: 'bar' } }
        });
        let executed = false;
        const p = {
            name: 'test',
            defaultConfig: { fallback: true },
            hooks: {
                'onBoot': (ctx) => {
                    executed = true;
                    expect(ctx.plugin.name).toBe('test');
                    expect(ctx.config.foo).toBe('bar'); // Overridden host
                    expect(ctx.config.fallback).toBe(true); // Default merged
                    expect(ctx.payload).toBe('hello');
                }
            }
        };
        manager.register(p);
        await manager.init();
        await manager.runLifecycle('onBoot', 'hello');
        expect(executed).toBe(true);
    });
    it('should reject lifecycle execution before init', async () => {
        const manager = new plugin_manager_1.PluginManager({ lifecycles: ['onBoot'] });
        await expect(manager.runLifecycle('onBoot')).rejects.toThrow(/not initialized/);
    });
    it('should make services available after init', async () => {
        const manager = new plugin_manager_1.PluginManager({ lifecycles: [] });
        manager.register({
            name: 'srvPlugin',
            services: {
                'srvPlugin.db': { connected: true }
            }
        });
        await manager.init();
        const service = manager.getService('srvPlugin.db');
        expect(service).toBeDefined();
        expect(service.connected).toBe(true);
    });
});
//# sourceMappingURL=plugin-manager.spec.js.map