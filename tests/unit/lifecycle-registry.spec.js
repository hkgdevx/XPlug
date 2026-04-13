"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lifecycle_registry_1 = require("@core/lifecycle-registry");
describe('LifecycleRegistry', () => {
    let registry;
    const mockContextBuilder = (pluginName) => {
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
        registry = new lifecycle_registry_1.LifecycleRegistry(['onBoot', 'onShutdown']);
    });
    it('should throw an error if a plugin hooks into an unknown lifecycle', () => {
        const p = {
            name: 'test',
            hooks: { 'unknownEvent': () => { } }
        };
        expect(() => registry.registerPluginHooks(p)).toThrow(/unknown lifecycle 'unknownEvent'/);
    });
    it('should correctly register hooks array', async () => {
        const hits = [];
        const p = {
            name: 'logPlugin',
            hooks: {
                'onBoot': [
                    () => { hits.push('A'); },
                    async () => { hits.push('B'); }
                ]
            }
        };
        registry.registerPluginHooks(p);
        await registry.runLifecycle('onBoot', mockContextBuilder);
        expect(hits).toEqual(['A', 'B']);
    });
    it('should await async hooks sequentially across multiple plugins', async () => {
        const order = [];
        registry.registerPluginHooks({
            name: 'first',
            hooks: {
                'onBoot': async () => {
                    await new Promise(r => setTimeout(r, 10));
                    order.push('first');
                }
            }
        });
        registry.registerPluginHooks({
            name: 'second',
            hooks: {
                'onBoot': () => {
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
//# sourceMappingURL=lifecycle-registry.spec.js.map