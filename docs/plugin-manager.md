# Context Factory & Plugin Manager

At the heart of the engine sits the `PluginManager` delegating rules.

## Plugin Manager
The MVP orchestrator. Responsibilities include:
1. Absorbing `.register()` calls and immediately identifying toggled states to skip initialization securely (`enabled: false`).
2. Holding configuration parameters safely from plugin mutations, mapping assertions cleanly globally.
3. Providing `.init()`, mapping topological sorts across sub-components, and firing services into the `ServiceRegistry`. 
4. Orchestrating lifecycle events downward via `LifecycleRegistry`.
5. Exposing `.getDiagnostics()` to aggregate telemetry and initialization histories synchronously.

## Context Factory
Every handler execution in a plugin deserves scoped boundaries. `ContextFactory` is tasked with materializing `PluginContext`. It merges defaults with host configuration overrides seamlessly and fetches the proper persistent `pluginState`.

### Sandboxing Protections
Context factories now evaluate dynamic `capabilities` matrices. If your plugin definition does not possess explicitly permitted capabilities (e.g., `emit`), the ContextFactory generates native proxy-functions securely rejecting interactions automatically preventing unverified event payloads.
