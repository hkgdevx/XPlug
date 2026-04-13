import { ServiceRegistry } from '@core/service-registry';
import { ServiceConflictError } from '@core/errors';

describe('ServiceRegistry', () => {
  let registry: ServiceRegistry;

  beforeEach(() => {
    registry = new ServiceRegistry();
  });

  it('should register and retrieve a service', () => {
    const mockService = { execute: () => true };
    registry.register('testPlugin.mockService', mockService);

    expect(registry.get('testPlugin.mockService')).toBe(mockService);
  });

  it('should throw ServiceConflictError on duplicate registration', () => {
    registry.register('testPlugin.mock', {});
    expect(() => registry.register('testPlugin.mock', {}, 'testPlugin2')).toThrow(ServiceConflictError);
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
