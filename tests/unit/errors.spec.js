"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@core/errors");
describe('Core Errors', () => {
    it('should instantiate XPlugError correctly', () => {
        const err = new errors_1.XPlugError('Test error', 'pluginA');
        expect(err).toBeInstanceOf(Error);
        expect(err.name).toBe('XPlugError');
        expect(err.message).toBe('Test error');
        expect(err.pluginName).toBe('pluginA');
    });
    it('should format DuplicatePluginError correctly', () => {
        const err = new errors_1.DuplicatePluginError('authPlugin');
        expect(err).toBeInstanceOf(errors_1.XPlugError);
        expect(err.name).toBe('DuplicatePluginError');
        expect(err.message).toBe("Plugin 'authPlugin' is already registered.");
        expect(err.pluginName).toBe('authPlugin');
    });
    it('should format DependencyError correctly', () => {
        const err = new errors_1.DependencyError('authPlugin', 'dbPlugin');
        expect(err).toBeInstanceOf(errors_1.XPlugError);
        expect(err.name).toBe('DependencyError');
        expect(err.message).toBe("Plugin 'authPlugin' requires missing dependency 'dbPlugin'.");
        expect(err.pluginName).toBe('authPlugin');
    });
    it('should format CircularDependencyError correctly', () => {
        const err = new errors_1.CircularDependencyError('pluginA', 'A -> B -> A');
        expect(err).toBeInstanceOf(errors_1.XPlugError);
        expect(err.name).toBe('CircularDependencyError');
        expect(err.message).toContain("Circular dependency detected involving plugin 'pluginA'");
        expect(err.message).toContain('A -> B -> A');
        expect(err.pluginName).toBe('pluginA');
    });
    it('should format ServiceConflictError correctly', () => {
        const err = new errors_1.ServiceConflictError('authPlugin.validate', 'authPlugin');
        expect(err).toBeInstanceOf(errors_1.XPlugError);
        expect(err.name).toBe('ServiceConflictError');
        expect(err.message).toBe("Service 'authPlugin.validate' is already registered.");
        expect(err.pluginName).toBe('authPlugin');
    });
});
//# sourceMappingURL=errors.spec.js.map