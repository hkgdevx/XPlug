# Express Adapter

XPlug provides a dedicated package entrypoint for Express.js bridging (`src/express`).

This adapter extends the pure typescript core using Module Augmentation to add metadata properties specifically for HTTP handling:
- `middleware`: A factory array for Express middleware injection points.
- `routes`: A factory for injecting endpoints into an isolated `express.Router()`.
- `routeBasePath`: Overrides the default string namespace root for this plugin's router.

## The Diagnostics Dashboard
XPlug Express provides a powerful native `/diagnostics` endpoint natively.
By mounting `app.use('/xplug', expressPluginDashboard(system))`, the engine yields JSON payloads aggregating strictly what topological pipelines deployed safely and highlighting metrics measuring explicitly how long `Date.now()` logic choked loops across individual plugin Hooks.

By pushing this logic outward into a companion namespace `xplug/express`, we fulfill the SRS' strict requirement that the core `PluginManager` operates blindly as to what sort of runtime host actually executes its plugins.
