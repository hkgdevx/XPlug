"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependency_resolver_1 = require("@core/dependency-resolver");
const errors_1 = require("@core/errors");
describe('DependencyResolver', () => {
    it('should sort plugins without dependencies in stable order', () => {
        const plugins = [
            { name: 'b' },
            { name: 'a' }
        ];
        const sorted = dependency_resolver_1.DependencyResolver.sort(plugins);
        expect(sorted.map(p => p.name)).toEqual(['b', 'a']);
    });
    it('should sort dependent plugins so dependencies come first', () => {
        const plugins = [
            { name: 'c', dependencies: ['a'] },
            { name: 'a' },
            { name: 'b', dependencies: ['a', 'c'] }
        ];
        const sorted = dependency_resolver_1.DependencyResolver.sort(plugins);
        expect(sorted.map(p => p.name)).toEqual(['a', 'c', 'b']);
    });
    it('should throw DependencyError for missing required dependencies', () => {
        const plugins = [
            { name: 'a', dependencies: ['missing'] }
        ];
        expect(() => dependency_resolver_1.DependencyResolver.sort(plugins)).toThrow(errors_1.DependencyError);
    });
    it('should ignore missing optional dependencies but respect present ones', () => {
        const plugins = [
            { name: 'b', optionalDependencies: ['a', 'missing'] },
            { name: 'a' }
        ];
        const sorted = dependency_resolver_1.DependencyResolver.sort(plugins);
        // 'a' is present, so 'b' must come after 'a'
        expect(sorted.map(p => p.name)).toEqual(['a', 'b']);
    });
    it('should throw CircularDependencyError on strict cycles', () => {
        const plugins = [
            { name: 'a', dependencies: ['b'] },
            { name: 'b', dependencies: ['a'] }
        ];
        expect(() => dependency_resolver_1.DependencyResolver.sort(plugins)).toThrow(errors_1.CircularDependencyError);
    });
    it('should throw CircularDependencyError on deep cycles', () => {
        const plugins = [
            { name: 'a', dependencies: ['b'] },
            { name: 'b', dependencies: ['c'] },
            { name: 'c', dependencies: ['a'] }
        ];
        expect(() => dependency_resolver_1.DependencyResolver.sort(plugins)).toThrow(errors_1.CircularDependencyError);
    });
});
//# sourceMappingURL=dependency-resolver.spec.js.map