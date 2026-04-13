# XPlug — Software Requirements Specification (SRS)

## 1. Document Control

**Product Name:** XPlug  
**Type:** Node.js library  
**Primary Runtime:** Node.js  
**Primary Language:** TypeScript  
**Primary Target Framework:** Express.js  
**Document Version:** 1.0  
**Status:** Draft for implementation  

---

## 2. Executive Summary

XPlug is a TypeScript-first plugin architecture library for Node.js applications, initially focused on Express.js integration. It enables host applications to load, validate, initialize, orchestrate, and manage custom plugins through a lifecycle-driven model.

The system must support:

- custom lifecycle definitions by the host application
- plugin registration and discovery
- plugin dependency resolution
- plugin hooks and extensibility points
- plugin-provided services
- plugin-provided middleware and routes for Express
- controlled plugin execution context
- structured initialization and shutdown
- future extensibility toward a richer plugin ecosystem

XPlug is intended to be the core engine for modular, plugin-driven backend applications where features can be shipped as plugins rather than tightly coupled modules.

---

## 3. Problem Statement

Express applications often grow into tightly coupled systems where features are added directly into the application core. This creates the following issues:

- poor modularity
- weak boundaries between features
- difficulty enabling or disabling features
- no standard plugin contract
- no coordinated lifecycle management
- hard-to-maintain initialization order
- fragile feature dependencies
- poor reuse across projects

XPlug addresses this by standardizing how plugins are authored, loaded, executed, and integrated into an Express application.

---

## 4. Goals

### 4.1 Primary Goals

1. Provide a clean plugin contract for third-party or internal plugins.
2. Allow host apps to define custom lifecycle names and trigger them at runtime.
3. Support deterministic plugin initialization through dependency resolution.
4. Allow plugins to register services, middleware, and routes.
5. Expose a safe and structured plugin context.
6. Support gradual ecosystem growth without breaking the core model.

### 4.2 Secondary Goals

1. Enable plugin discovery from filesystem or direct registration.
2. Support plugin-specific configuration and validation.
3. Allow future evolution into CLI tooling, plugin packaging, and marketplace support.

### 4.3 Non-Goals for MVP

1. Full sandboxing of untrusted plugins.
2. Browser-based plugin marketplace.
3. Remote plugin download/install service.
4. Multi-process or VM isolation.
5. Framework support beyond Express in the first release.

---

## 5. Stakeholders

### 5.1 Primary Stakeholders

- library author / maintainer
- backend developers building modular Express apps
- teams building internal feature plugins
- teams building reusable plugin ecosystems

### 5.2 Secondary Stakeholders

- DevOps teams managing deployments of plugin-enabled apps
- QA teams testing plugin combinations
- future third-party plugin authors

---

## 6. Product Scope

XPlug is a reusable Node.js package that provides:

- plugin definition primitives
- plugin manager / orchestrator
- lifecycle engine
- dependency resolver
- service registry
- Express integration layer
- configuration plumbing
- structured errors and diagnostics

The host application remains responsible for:

- creating the Express app
- defining available lifecycle names
- choosing which plugins to install/load
- providing runtime config
- calling lifecycle events when appropriate
- starting and stopping the HTTP server

---

## 7. Definitions

### Plugin
A self-contained unit that declares metadata and contributes behavior through hooks, services, middleware, or routes.

### Lifecycle
A named execution stage or event that plugins can subscribe to. Lifecycles may represent startup phases, shutdown phases, or domain-specific events.

### Hook
A plugin handler function attached to a lifecycle.

### Host Application
The Node.js application that uses XPlug.

### Service
A reusable object or capability registered by a plugin for consumption by the host or other plugins.

### Plugin Context
The runtime object provided to plugin hooks and factories, containing scoped access to app resources.

---

## 8. Assumptions

1. Plugins are trusted code for MVP.
2. The host app runs in a single Node.js process.
3. Plugins are authored in JavaScript or TypeScript and loaded into the same runtime.
4. Express is the primary HTTP layer for MVP.
5. TypeScript typings are first-class, but runtime JS support must also work.

---

## 9. Constraints

1. Must run on actively supported Node.js LTS versions.
2. Must work with Express 4.x and be designed to remain compatible with Express 5.x where feasible.
3. Must avoid unnecessary runtime complexity.
4. Must not force a DI framework.
5. Must not require a database.

---

## 10. High-Level Architecture

XPlug shall be composed of the following subsystems:

1. **Core Types Module**  
   Defines plugin contracts, lifecycle contracts, service contracts, and context types.

2. **Plugin Manager**  
   Registers plugins, validates contracts, resolves dependencies, initializes plugins, runs lifecycles, mounts integrations, and manages shutdown.

3. **Lifecycle Engine**  
   Stores lifecycle definitions and runs attached hooks in deterministic order.

4. **Dependency Resolver**  
   Validates required dependencies, optional dependencies, and circular dependency conditions.

5. **Service Registry**  
   Stores named services registered by plugins.

6. **Express Adapter**  
   Mounts plugin middleware and routers into the Express application.

7. **Config Layer**  
   Merges plugin default config with host-provided config and optionally validates it.

8. **Discovery Layer**  
   Loads plugins from direct input or filesystem locations.

9. **Diagnostics / Error Layer**  
   Produces structured errors, execution traces, and plugin-level fault reporting.

---

## 11. Functional Requirements

## 11.1 Plugin Definition

### FR-001
The system shall provide a standard plugin definition format.

### FR-002
A plugin definition shall contain at minimum a unique `name`.

### FR-003
A plugin definition may contain the following fields:

- `name`
- `version`
- `description`
- `enabled`
- `dependencies`
- `optionalDependencies`
- `defaultConfig`
- `configSchema`
- `hooks`
- `services`
- `middleware`
- `routes`
- `routeBasePath`
- future extension fields through metadata

### FR-004
The system shall expose a helper such as `definePlugin()` for typed plugin declaration.

### FR-005
Plugin names must be unique within a plugin manager instance.

---

## 11.2 Plugin Registration

### FR-010
The system shall allow direct registration of individual plugins.

### FR-011
The system shall allow batch registration of multiple plugins.

### FR-012
The system shall reject duplicate plugin names.

### FR-013
The system shall preserve original plugin metadata for diagnostics.

---

## 11.3 Lifecycle Definition and Execution

### FR-020
The host application shall be able to define lifecycle names during plugin system creation.

### FR-021
The system shall allow plugins to attach hooks to any lifecycle name.

### FR-022
The system shall allow runtime triggering of a lifecycle with optional payload.

### FR-023
The system shall execute lifecycle hooks in deterministic order.

### FR-024
Lifecycle execution order shall respect plugin dependency order.

### FR-025
A lifecycle hook may be synchronous or asynchronous.

### FR-026
The system shall await asynchronous lifecycle hooks before advancing to the next hook.

### FR-027
The system shall support multiple hooks per lifecycle per plugin.

### FR-028
The system shall permit custom non-startup lifecycle names, including domain events such as `onOrderCreated`.

### FR-029
The system shall expose an `emit` or equivalent method within plugin context to trigger another lifecycle.

### FR-030
The system shall support passing payloads to lifecycle handlers.

### FR-031
The system shall provide optional lifecycle hook priorities in a later MVP+ release, but base execution order shall already be deterministic in MVP.

---

## 11.4 Plugin Context

### FR-040
The system shall provide each plugin hook with a plugin context.

### FR-041
The plugin context shall include:

- reference to Express app
- current plugin metadata
- merged plugin config
- logger interface
- service registry access
- lifecycle emit function
- optional lifecycle payload
- plugin-local state store

### FR-042
The plugin-local state store shall be isolated per plugin.

### FR-043
The context shall not expose private internal plugin manager structures directly.

---

## 11.5 Dependency Resolution

### FR-050
Plugins may declare required dependencies by plugin name.

### FR-051
Plugins may declare optional dependencies by plugin name.

### FR-052
The system shall validate that all required dependencies are present before initialization.

### FR-053
The system shall resolve plugin execution order using dependency-aware topological sorting.

### FR-054
The system shall detect circular dependencies and fail initialization with a structured error.

### FR-055
Optional dependencies shall affect ordering only when the referenced plugin is present.

---

## 11.6 Services

### FR-060
A plugin may register one or more services.

### FR-061
Services shall be stored in a shared registry.

### FR-062
A service shall be retrievable by name.

### FR-063
The system shall prevent duplicate service registration under the same fully-qualified name.

### FR-064
The default recommended service naming pattern shall be `pluginName.serviceName`.

### FR-065
Services registered by a plugin shall be accessible to other plugins and optionally to the host app.

---

## 11.7 Express Middleware Integration

### FR-070
A plugin may contribute Express middleware.

### FR-071
Middleware factories may be synchronous or asynchronous.

### FR-072
The system shall mount plugin middleware into the Express app in dependency-aware order.

### FR-073
Middleware registration shall occur only when explicitly invoked by the host or during a defined init phase.

---

## 11.8 Express Route Integration

### FR-080
A plugin may contribute Express routes.

### FR-081
Route factories may receive a plugin-scoped router instance.

### FR-082
The system shall mount plugin routers into the Express app.

### FR-083
Each plugin may define a custom route base path.

### FR-084
If no custom route base path is provided, the system shall use a default namespaced base path.

### FR-085
The system shall mount routes in deterministic dependency-aware order.

---

## 11.9 Plugin Initialization and Shutdown

### FR-090
The system shall expose an initialization method that prepares plugins for runtime.

### FR-091
Initialization shall validate registration state and dependency graph before executing plugin-provided service factories.

### FR-092
The system shall support orderly shutdown through lifecycle invocation.

### FR-093
The host app shall be able to trigger a shutdown lifecycle such as `onShutdown`.

---

## 11.10 Plugin Discovery

### FR-100
The system shall support manual plugin registration in MVP.

### FR-101
The system should support filesystem-based plugin discovery in MVP+.

### FR-102
Filesystem discovery shall load plugin modules from configured directories.

### FR-103
Discovery shall support default exports and named exports based on documented rules.

### FR-104
Discovery failures shall identify the plugin path and failure reason.

---

## 11.11 Configuration

### FR-110
The system shall allow host-level configuration for each plugin.

### FR-111
Plugin runtime config shall be produced by merging default plugin config with host-provided overrides.

### FR-112
The system should support optional runtime config validation via schema.

### FR-113
Config validation failures shall stop plugin initialization for the offending plugin.

---

## 11.12 Diagnostics and Introspection

### FR-120
The system shall expose a way to list registered plugins.

### FR-121
The system shall expose a way to list initialized plugins.

### FR-122
The system should expose lifecycle execution diagnostics in a later phase.

### FR-123
The system shall provide meaningful structured errors for registration, dependency, config, and execution failures.

---

## 12. Non-Functional Requirements

## 12.1 Performance

### NFR-001
Plugin registration overhead shall be low enough for typical backend startup workflows.

### NFR-002
Lifecycle execution shall not introduce unnecessary scheduling or polling layers.

### NFR-003
The core runtime shall avoid expensive reflection-heavy operations on hot paths.

---

## 12.2 Reliability

### NFR-010
Initialization failures shall fail fast with precise diagnostics.

### NFR-011
Dependency resolution shall be deterministic.

### NFR-012
The library shall not leave partially initialized state without surfacing it clearly.

---

## 12.3 Maintainability

### NFR-020
The codebase shall be modular and split into core and Express-specific adapters.

### NFR-021
Public types and interfaces shall be documented.

### NFR-022
Internal modules shall be unit-testable in isolation.

---

## 12.4 Usability

### NFR-030
The public API shall be minimal and intuitive.

### NFR-031
Error messages shall identify the offending plugin and operation.

### NFR-032
The library should work well for both small apps and larger ecosystems.

---

## 12.5 Compatibility

### NFR-040
The library shall support modern TypeScript projects and standard CommonJS/ESM interop where feasible.

### NFR-041
The library shall publish typings.

---

## 12.6 Security

### NFR-050
The system shall treat plugins as trusted code for MVP.

### NFR-051
The design shall not preclude future sandboxing or restricted contexts.

---

## 13. User Stories

### US-001
As a backend developer, I want to register plugins so that application features can be modularized.

### US-002
As a host app developer, I want to define custom lifecycle names so that plugins can react to app-specific events.

### US-003
As a plugin author, I want to expose services so that other plugins can reuse my functionality.

### US-004
As a plugin author, I want to add Express routes and middleware so that my plugin can extend HTTP behavior.

### US-005
As a platform maintainer, I want deterministic startup order so that dependencies initialize safely.

### US-006
As a developer, I want useful errors when dependencies are missing or circular so that debugging is straightforward.

---

## 14. Public API Requirements

## 14.1 Core API

The MVP public API shall include the following exported functions/classes:

- `definePlugin()`
- `createPluginSystem()`
- `PluginManager` or equivalent manager instance
- public types for plugin definitions and contexts

## 14.2 Manager Capabilities

The manager instance shall provide methods equivalent to:

- `register(plugin)`
- `registerMany(plugins)`
- `init()`
- `runLifecycle(name, payload?)`
- `mountMiddleware()`
- `mountRoutes()`
- `getService(name)`
- `listPlugins()`
- `getPlugin(name)`

## 14.3 Context Capabilities

Plugin context shall provide:

- `app`
- `plugin`
- `config`
- `logger`
- `services`
- `state`
- `payload`
- `emit()`

---

## 15. Data Model / Types

## 15.1 Plugin Definition

A plugin definition shall conceptually follow this shape:

```ts
interface PluginDefinition<TConfig = any> {
  name: string;
  version?: string;
  description?: string;
  enabled?: boolean;
  dependencies?: string[];
  optionalDependencies?: string[];
  defaultConfig?: TConfig;
  configSchema?: unknown;
  hooks?: Record<string, PluginHook | PluginHook[]>;
  services?: PluginServiceFactory;
  middleware?: PluginMiddlewareFactory;
  routes?: PluginRouteFactory;
  routeBasePath?: string;
}
```

## 15.2 Hook Type

```ts
type PluginHook = (ctx: PluginContext) => void | Promise<void>;
```

## 15.3 Plugin Context

```ts
interface PluginContext {
  app: Express;
  plugin: { name: string; version?: string };
  logger: LoggerLike;
  config: Record<string, any>;
  services: ServiceRegistry;
  payload?: unknown;
  state: Map<string, unknown>;
  emit: (lifecycle: string, payload?: unknown) => Promise<void>;
}
```

---

## 16. Initialization Sequence

The standard boot sequence shall be:

1. Host app creates Express app.
2. Host app creates XPlug system with lifecycle names.
3. Host app registers plugins.
4. Host app invokes `init()`.
5. XPlug validates registrations.
6. XPlug resolves dependencies.
7. XPlug builds plugin contexts.
8. XPlug runs plugin service factories.
9. Host app invokes startup lifecycle(s), such as `onBoot`.
10. Host app mounts middleware.
11. Host app mounts routes.
12. Host app invokes later lifecycles such as `beforeListen` and `afterListen`.

Shutdown sequence shall be:

1. Host app captures shutdown signal.
2. Host app invokes `onShutdown` lifecycle.
3. Host app closes server and exits.

---

## 17. Error Handling Requirements

### ER-001
The system shall define structured error classes.

### ER-002
The following categories shall be represented:

- duplicate plugin registration error
- missing dependency error
- circular dependency error
- invalid plugin definition error
- service registration conflict error
- config validation error
- plugin execution error
- discovery/load error

### ER-003
Error messages shall include plugin name where applicable.

### ER-004
Execution errors shall preserve the original cause where possible.

### ER-005
The system should support fail-fast behavior by default.

### ER-006
Future versions may support configurable error strategies for some lifecycle runs.

---

## 18. Logging Requirements

### LR-001
The system shall accept a host-provided logger.

### LR-002
If no logger is provided, the system may default to `console`.

### LR-003
Plugin context shall expose the logger.

### LR-004
The system should log initialization and failure milestones at appropriate levels.

---

## 19. Packaging Requirements

### PKG-001
The package shall be published as an npm library.

### PKG-002
The package shall include TypeScript declaration files.

### PKG-003
The source shall be organized to separate core engine logic from Express integration logic.

### PKG-004
The package should support tree-shake-friendly exports where feasible.

---

## 20. Recommended Repository Structure

```txt
xplug/
├─ src/
│  ├─ core/
│  │  ├─ types.ts
│  │  ├─ errors.ts
│  │  ├─ plugin-manager.ts
│  │  ├─ lifecycle-registry.ts
│  │  ├─ dependency-resolver.ts
│  │  ├─ service-registry.ts
│  │  ├─ context-factory.ts
│  │  └─ config-resolver.ts
│  ├─ express/
│  │  ├─ mount-middleware.ts
│  │  ├─ mount-routes.ts
│  │  └─ types.ts
│  ├─ discovery/
│  │  └─ load-from-dir.ts
│  ├─ public/
│  │  ├─ define-plugin.ts
│  │  ├─ create-plugin-system.ts
│  │  └─ index.ts
│  └─ utils/
│     ├─ guards.ts
│     └─ normalize.ts
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ fixtures/
├─ examples/
│  ├─ basic-express-app/
│  └─ custom-lifecycle-app/
├─ package.json
├─ tsconfig.json
├─ README.md
└─ LICENSE
```

---

## 21. Testing Requirements

## 21.1 Unit Tests

The implementation shall include unit tests for:

- plugin registration
- duplicate rejection
- dependency resolution
- circular dependency detection
- lifecycle execution order
- async lifecycle awaiting
- service registration and retrieval
- config merging
- context creation
- route mounting
- middleware mounting
- error class behavior

## 21.2 Integration Tests

The implementation shall include integration tests for:

- booting an Express app with multiple plugins
- dependency-based load ordering
- route exposure through plugins
- middleware interaction
- custom lifecycle payload flow
- shutdown lifecycle execution

## 21.3 Example Validation

The repository should include runnable examples that act as living documentation.

---

## 22. Acceptance Criteria

The MVP shall be considered complete when:

1. A host app can define custom lifecycle names.
2. Plugins can register hooks for those lifecycles.
3. The system can resolve plugin dependencies safely.
4. Plugins can register services.
5. Plugins can mount middleware and routes into Express.
6. The host app can trigger startup, runtime, and shutdown lifecycles.
7. Errors are structured and understandable.
8. Unit and integration tests cover the main flow.
9. The package can be installed and used in a sample Express app.

---

## 23. Future Enhancements

These are intentionally out of MVP scope but should influence the design:

1. lifecycle hook priorities
2. enable/disable toggles per plugin
3. filesystem discovery improvements
4. plugin manifests
5. plugin packaging/signing
6. CLI for scaffolding plugins
7. plugin health/status reporting
8. sandboxing or reduced-capability contexts
9. metrics and tracing for plugin execution
10. support for frameworks beyond Express

---

## 24. Suggested Implementation Phases

## Phase 1 — Core MVP

- core types
- plugin manager
- dependency resolver
- lifecycle execution
- service registry
- definePlugin helper
- createPluginSystem factory

## Phase 2 — Express Integration

- middleware mounting
- router mounting
- examples with Express app

## Phase 3 — Stability

- structured errors
- config resolution
- tests
- docs

## Phase 4 — Discovery and Ecosystem Basics

- filesystem plugin discovery
- richer diagnostics
- hook priorities

---

## 25. Coding Agent Delivery Guidance

The coding agent implementing XPlug should follow these execution rules:

1. Build core engine before discovery features.
2. Keep core free from Express-specific assumptions except in dedicated adapter modules.
3. Prefer simple, explicit public APIs over hidden magic.
4. Write tests alongside each module.
5. Use dependency-aware deterministic ordering everywhere.
6. Use TypeScript types as part of the public contract, not as an afterthought.
7. Avoid premature abstraction beyond the plugin model described here.

---

## 26. Example Host App Flow

```ts
const app = express();

const xplug = createPluginSystem({
  app,
  lifecycles: [
    'onBoot',
    'beforeRoutes',
    'afterRoutes',
    'beforeListen',
    'afterListen',
    'onShutdown',
    'onOrderCreated'
  ],
  logger: console,
  config: {
    loggerPlugin: { level: 'info' }
  }
});

xplug.register(loggerPlugin);
xplug.register(orderAuditPlugin);

await xplug.init();
await xplug.runLifecycle('onBoot');
await xplug.mountMiddleware();
await xplug.mountRoutes();
await xplug.runLifecycle('beforeListen');

const server = app.listen(3000, async () => {
  await xplug.runLifecycle('afterListen');
});

process.on('SIGINT', async () => {
  await xplug.runLifecycle('onShutdown');
  server.close();
});
```

---

## 27. Final Product Positioning

XPlug is not just a helper library for Express. It is a lifecycle-driven plugin engine for building modular Node.js systems where features are packaged as plugins and orchestrated through explicit contracts.

