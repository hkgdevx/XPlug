import { PluginManager } from '@core/plugin-manager';
import { PluginDefinition } from '@core/types';

describe('Phase 6: Toggles & Sandboxing', () => {
  it('should ignore plugins marked as enabled: false', async () => {
    const manager = new PluginManager({ lifecycles: ['onBoot'] });
    const p1: PluginDefinition = { name: 'p1', enabled: false };
    const p2: PluginDefinition = { name: 'p2' };

    manager.register(p1);
    manager.register(p2);
    await manager.init();

    const diagnostics = manager.getDiagnostics();
    expect(diagnostics.initializedPlugins).not.toContain('p1');
    expect(diagnostics.initializedPlugins).toContain('p2');
  });

  it('should throw when sandboxed plugin attempts to emit', async () => {
    const manager = new PluginManager({ lifecycles: ['onBoot', 'onDynamic'] });
    const p1: PluginDefinition = {
      name: 'p1',
      capabilities: ['logger'], // Explicitly omitting 'emit' capability
      hooks: {
        onBoot: async ctx => {
          await ctx.emit('onDynamic');
        }
      }
    };

    manager.register(p1);
    await manager.init();

    // Since we omit 'emit', attempting to emit causes a strict sandboxing error.
    await expect(manager.runLifecycle('onBoot')).rejects.toThrow(/sandboxed and restricted from emitting/);
  });
});
