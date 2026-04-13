import { DependencyResolver } from '@core/dependency-resolver';
import { DependencyError, CircularDependencyError } from '@core/errors';
import { PluginDefinition } from '@core/types';

describe('DependencyResolver', () => {
  it('should sort plugins without dependencies in stable order', () => {
    const plugins: PluginDefinition[] = [{ name: 'b' }, { name: 'a' }];
    const sorted = DependencyResolver.sort(plugins);
    expect(sorted.map(p => p.name)).toEqual(['b', 'a']);
  });

  it('should sort dependent plugins so dependencies come first', () => {
    const plugins: PluginDefinition[] = [
      { name: 'c', dependencies: ['a'] },
      { name: 'a' },
      { name: 'b', dependencies: ['a', 'c'] }
    ];
    const sorted = DependencyResolver.sort(plugins);
    expect(sorted.map(p => p.name)).toEqual(['a', 'c', 'b']);
  });

  it('should throw DependencyError for missing required dependencies', () => {
    const plugins: PluginDefinition[] = [{ name: 'a', dependencies: ['missing'] }];
    expect(() => DependencyResolver.sort(plugins)).toThrow(DependencyError);
  });

  it('should ignore missing optional dependencies but respect present ones', () => {
    const plugins: PluginDefinition[] = [{ name: 'b', optionalDependencies: ['a', 'missing'] }, { name: 'a' }];
    const sorted = DependencyResolver.sort(plugins);
    // 'a' is present, so 'b' must come after 'a'
    expect(sorted.map(p => p.name)).toEqual(['a', 'b']);
  });

  it('should throw CircularDependencyError on strict cycles', () => {
    const plugins: PluginDefinition[] = [
      { name: 'a', dependencies: ['b'] },
      { name: 'b', dependencies: ['a'] }
    ];
    expect(() => DependencyResolver.sort(plugins)).toThrow(CircularDependencyError);
  });

  it('should throw CircularDependencyError on deep cycles', () => {
    const plugins: PluginDefinition[] = [
      { name: 'a', dependencies: ['b'] },
      { name: 'b', dependencies: ['c'] },
      { name: 'c', dependencies: ['a'] }
    ];
    expect(() => DependencyResolver.sort(plugins)).toThrow(CircularDependencyError);
  });
});
