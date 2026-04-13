# Lifecycle Registry

The `LifecycleRegistry` acts as the execution engine for the XPlug architecture.

It requires the host application to front-load a definitive array of string `lifecycles` during instantiation. 

### Key Behaviors
1. **Validation**: Throws an error if a plugin tries to attach a hook to an undefined or unregistered lifecycle. 
2. **Order Preservation**: Expects `registerPluginHooks()` to be called iteratively over the topologically sorted plugins array. The hooks are appended to internal phase queues. Hook objects can additionally define `priority` indices resolving determinism amongst identical graph tiers safely.
3. **Execution (`runLifecycle`)**: Uses `for` loop awaits to ensure that if a plugin hook returns a Promise, XPlug explicitly halts and waits for its resolution before moving to the next hook in sequence.
4. **Telemetry Analytics**: Iterative loop phases log `Date.now()` differences implicitly building `getTelemetry()` output diagnostics natively!
