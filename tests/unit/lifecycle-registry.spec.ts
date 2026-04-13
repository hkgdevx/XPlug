import { LifecycleRegistry } from '@core/lifecycle-registry';
import { PluginDefinition, PluginContext } from '@core/types';

describe('LifecycleRegistry', () => {
  let registry: LifecycleRegistry;

  const mockContextBuilder = (pluginName: string): PluginContext => {
    return {
      plugin: { name: pluginName },
      logger: {},
      config: {},
      services: {},
      state: new Map(),
      emit: jest.fn()
    };
  };

  beforeEach(() => {
    registry = new LifecycleRegistry(['onBoot', 'onShutdown']);
  });

  it('should throw an error if a plugin hooks into an unknown lifecycle', () => {
    const p: PluginDefinition = {
      name: 'test',
      hooks: { unknownEvent: () => {} }
    };
    expect(() => registry.registerPluginHooks(p)).toThrow(/unknown lifecycle 'unknownEvent'/);
  });

  it('should correctly register hooks array', async () => {
    const hits: string[] = [];

    const p: PluginDefinition = {
      name: 'logPlugin',
      hooks: {
        onBoot: [
          () => {
            hits.push('A');
          },
          async () => {
            hits.push('B');
          }
        ]
      }
    };

    registry.registerPluginHooks(p);
    await registry.runLifecycle('onBoot', mockContextBuilder);

    expect(hits).toEqual(['A', 'B']);
  });

  it('should await async hooks sequentially across multiple plugins', async () => {
    const order: string[] = [];

    registry.registerPluginHooks({
      name: 'first',
      hooks: {
        onBoot: async () => {
          await new Promise(r => setTimeout(r, 10));
          order.push('first');
        }
      }
    });

    registry.registerPluginHooks({
      name: 'second',
      hooks: {
        onBoot: () => {
          order.push('second');
        }
      }
    });

    await registry.runLifecycle('onBoot', mockContextBuilder);

    // If it didn't wait, 'second' would execute before 'first' due to setTimeout
    expect(order).toEqual(['first', 'second']);
  });

  it('should throw an error if running an unknown lifecycle', async () => {
    await expect(registry.runLifecycle('badPhase', mockContextBuilder)).rejects.toThrow(/unknown lifecycle 'badPhase'/);
  });
});
