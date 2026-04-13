# Core Types & Errors

As the foundational block, `types.ts` exposes standard definitions as requested by the SRS:

`PluginDefinition`: Defines plugin fields along with dependencies, configurations, sandboxing `capabilities`, and strict global boolean `enabled` filters.
`PluginHook` / `PluginContext`: Execution objects carrying plugin-specific priority overrides, state, configs, and lifecycle emit boundaries.

The Express specific properties are intentionally omitted to follow strictly MVP isolation abstractions. 

## Exception Hierarchies
`errors.ts` implements standard structured errors, descending from `XPlugError`:
- `CircularDependencyError`: Automatically mapping visual `pluginA -> pluginB -> pluginA` cycle limits dynamically.
- `ConfigValidationError`: Highlighting duck-typed payload logic dropping parameters before lifecycle hooks trigger natively.
