# Architecture

## Core Components

XPlug operates through five main architectural pillars loosely coupled by dependency flow:

1. **Plugin Manager (`PluginManager`):** The orchestration boundary. It fields `register()` calls and orchestrates topological checks and initialization stages. It actively filters out any explicitly `enabled: false` plugins.
2. **Dependency Resolver:** Detects required/optional plugins and checks for circular references, yielding the deterministic execution graph.
3. **Lifecycle Engine:** Owns the `runLifecycle(name)` invocations. Pauses appropriately during async resolution, following the exact topological order. Maps strict timing telemetry on execution boundaries.
4. **Service Registry:** A typed boundary providing capability sharing (`getService()`) between plugins. 
5. **Context Factory:** Produces an isolated state/context slice per plugin to execute handlers safely, proxying capabilities securely natively.

## Completed Features
- **Express Adapter Mapping:** Logic mounting middleware, routers, and dynamic `expressPluginDashboard` diagnostics seamlessly.
- **Discovery Layer:** Implicit folder-based plugin loading (`loadFromDir`).
- **Duck-Typed Configs:** Plugin schema configurations generated mapping global parameters gracefully before boot execution.
- **Diagnostics & Sandboxing:** Granular toggles manipulating runtime limits and outputting analytics pipelines locally.
