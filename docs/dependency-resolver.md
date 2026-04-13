# Dependency Resolver

The `DependencyResolver` performs a topological sort. It evaluates the entire array of registered plugin definitions traversing `dependencies` and `optionalDependencies`.

### Key Behaviors
1. **Validation**: Throws `DependencyError` immediately if any strict `dependencies` are absent from the registry list.
2. **Deterministic Sequence**: Depth-first topological sorting ensures that any plugin relying on another will always execute *after* its dependencies. Optional dependencies only alter ordering if that dependency is also successfully registered.
3. **Cycle detection**: Traverses memory via a tracking `processing` Set (colored graph traversal). If a back-edge is hit, it throws a `CircularDependencyError` embedding the full traversal path (e.g., `A -> B -> A`).
