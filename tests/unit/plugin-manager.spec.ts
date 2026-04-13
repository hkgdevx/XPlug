import { PluginManager } from '@core/plugin-manager';
import { PluginDefinition } from '@core/types';
import { DuplicatePluginError, DependencyError } from '@core/errors';

describe('PluginManager', () => {
  it('should register and retrieve plugins', () => {
    const manager = new PluginManager({ lifecycles: [] });
    manager.register({ name: 'test' });
    expect(manager.listPlugins()).toEqual(['test']);
    expect(manager.getPlugin('test')).toBeDefined();
  });

  it('should throw on duplicate plugin name', () => {
    const manager = new PluginManager({ lifecycles: [] });
    manager.register({ name: 'dup' });
    expect(() => manager.register({ name: 'dup' })).toThrow(DuplicatePluginError);
  });

  it('should successfully orchestrate init and runLifecycle', async () => {
    const manager = new PluginManager({
      lifecycles: ['onBoot'],
      config: { test: { foo: 'bar' } }
    });

    let executed = false;

    const p: PluginDefinition = {
      name: 'test',
      defaultConfig: { fallback: true },
      hooks: {
        onBoot: ctx => {
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
    const manager = new PluginManager({ lifecycles: ['onBoot'] });
    await expect(manager.runLifecycle('onBoot')).rejects.toThrow(/not initialized/);
  });

  it('should make services available after init', async () => {
    const manager = new PluginManager({ lifecycles: [] });
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
