# Service Registry

The `ServiceRegistry` is a central hub for shared capabilities. Plugins can register explicit service objects (like a database connection instance, a logger, or an auth validator) under a unique namespace string (`pluginName.serviceName`).

Other plugins fetching from the registry at runtime get access to these objects directly. 

### Architecture Notes
- Uses an internal `Map` to guarantee sub-millisecond object lookup.
- Fast-fails via `ServiceConflictError` if two plugins attempt to claim the exact same string namespace. This aligns with deterministic validation. 
