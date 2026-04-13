import {
  XPlugError,
  DuplicatePluginError,
  DependencyError,
  CircularDependencyError,
  ServiceConflictError
} from '@core/errors';

describe('Core Errors', () => {
  it('should instantiate XPlugError correctly', () => {
    const err = new XPlugError('Test error', 'pluginA');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('XPlugError');
    expect(err.message).toBe('Test error');
    expect(err.pluginName).toBe('pluginA');
  });

  it('should format DuplicatePluginError correctly', () => {
    const err = new DuplicatePluginError('authPlugin');
    expect(err).toBeInstanceOf(XPlugError);
    expect(err.name).toBe('DuplicatePluginError');
    expect(err.message).toBe("Plugin 'authPlugin' is already registered.");
    expect(err.pluginName).toBe('authPlugin');
  });

  it('should format DependencyError correctly', () => {
    const err = new DependencyError('authPlugin', 'dbPlugin');
    expect(err).toBeInstanceOf(XPlugError);
    expect(err.name).toBe('DependencyError');
    expect(err.message).toBe("Plugin 'authPlugin' requires missing dependency 'dbPlugin'.");
    expect(err.pluginName).toBe('authPlugin');
  });

  it('should format CircularDependencyError correctly', () => {
    const err = new CircularDependencyError('pluginA', 'A -> B -> A');
    expect(err).toBeInstanceOf(XPlugError);
    expect(err.name).toBe('CircularDependencyError');
    expect(err.message).toContain("Circular dependency detected involving plugin 'pluginA'");
    expect(err.message).toContain('A -> B -> A');
    expect(err.pluginName).toBe('pluginA');
  });

  it('should format ServiceConflictError correctly', () => {
    const err = new ServiceConflictError('authPlugin.validate', 'authPlugin');
    expect(err).toBeInstanceOf(XPlugError);
    expect(err.name).toBe('ServiceConflictError');
    expect(err.message).toBe("Service 'authPlugin.validate' is already registered.");
    expect(err.pluginName).toBe('authPlugin');
  });
});
