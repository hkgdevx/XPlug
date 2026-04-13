"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_registry_1 = require("@core/service-registry");
const errors_1 = require("@core/errors");
describe('ServiceRegistry', () => {
    let registry;
    beforeEach(() => {
        registry = new service_registry_1.ServiceRegistry();
    });
    it('should register and retrieve a service', () => {
        const mockService = { execute: () => true };
        registry.register('testPlugin.mockService', mockService);
        expect(registry.get('testPlugin.mockService')).toBe(mockService);
    });
    it('should throw ServiceConflictError on duplicate registration', () => {
        registry.register('testPlugin.mock', {});
        expect(() => registry.register('testPlugin.mock', {}, 'testPlugin2'))
            .toThrow(errors_1.ServiceConflictError);
    });
    it('should return undefined for unregistered services', () => {
        expect(registry.get('missingService')).toBeUndefined();
    });
    it('should return all registered services', () => {
        registry.register('srv1', 1);
        registry.register('srv2', 2);
        const all = registry.getAll();
        expect(all).toEqual({ srv1: 1, srv2: 2 });
    });
});
//# sourceMappingURL=service-registry.spec.js.map