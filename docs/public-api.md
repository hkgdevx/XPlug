# Public API 

The `public` folder consolidates the external facing facade:

- `definePlugin`: An identity function leveraging TypeScript generics to guarantee standard plugin shapes gracefully for the user.
- `createPluginSystem`: Main factory method handling instantiation of `PluginManager`.
- `index.ts`: Consolidates exports.

By restricting standard consumers to these boundaries, `XPlug` is free to refactor `core` internally over the long term.
