/**
 * @file errors.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

export class XPlugError extends Error {
  constructor(
    message: string,
    public pluginName?: string
  ) {
    super(message);
    this.name = 'XPlugError';
  }
}

export class DuplicatePluginError extends XPlugError {
  constructor(pluginName: string) {
    super(`Plugin '${pluginName}' is already registered.`, pluginName);
    this.name = 'DuplicatePluginError';
  }
}

export class DependencyError extends XPlugError {
  constructor(pluginName: string, missingDependency: string) {
    super(`Plugin '${pluginName}' requires missing dependency '${missingDependency}'.`, pluginName);
    this.name = 'DependencyError';
  }
}

export class CircularDependencyError extends XPlugError {
  constructor(pluginName: string, cycleDetails: string) {
    super(`Circular dependency detected involving plugin '${pluginName}': ${cycleDetails}`, pluginName);
    this.name = 'CircularDependencyError';
  }
}

export class ConfigValidationError extends Error {
  constructor(
    public pluginName: string,
    public details: string
  ) {
    super(`Configuration validation failed for plugin '${pluginName}': ${details}`);
    this.name = 'ConfigValidationError';
  }
}

export class ServiceConflictError extends XPlugError {
  constructor(serviceName: string, pluginName?: string) {
    super(`Service '${serviceName}' is already registered.`, pluginName);
    this.name = 'ServiceConflictError';
  }
}
