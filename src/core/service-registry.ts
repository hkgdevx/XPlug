/**
 * @file service-registry.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import { ServiceConflictError } from './errors';

export class ServiceRegistry {
  private services = new Map<string, any>();

  /**
   * Registers a new service.
   * By convention, serviceName should be `pluginName.serviceName`.
   * @param serviceName The unique fully-qualified service name.
   * @param serviceInstance The service object or function.
   * @param sourcePlugin Optional plugin name for diagnostics.
   * @throws ServiceConflictError if the service already exists.
   */
  public register(serviceName: string, serviceInstance: any, sourcePlugin?: string): void {
    if (this.services.has(serviceName)) {
      throw new ServiceConflictError(serviceName, sourcePlugin);
    }
    this.services.set(serviceName, serviceInstance);
  }

  /**
   * Retrieves a service by its fully-qualified name.
   * @param serviceName The name of the service to retrieve.
   * @returns The registered service, or undefined if not found.
   */
  public get(serviceName: string): any {
    return this.services.get(serviceName);
  }

  /**
   * Retrieves all registered services as a record.
   */
  public getAll(): Record<string, any> {
    const all: Record<string, any> = {};
    for (const [name, service] of this.services.entries()) {
      all[name] = service;
    }
    return all;
  }
}
