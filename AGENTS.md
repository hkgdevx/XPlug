# Code Guidelines for Agents

When implementing features or adjusting the codebase, AI coding agents should observe these strict rules:

1. **Docs first, code second**: Every minor or major module needs a `/docs` element. 
2. **Deterministic execution**: When looping logic across `PluginContext` or hooks, respect the topological order produced in `dependency-resolver`.
3. **No premature abstractions**: Do not assume `Express` presence in the core types if not building an Express adapter. Keep it node-generic.
4. **Update task limits**: Mark task checkmarks in `task.md` whenever transitioning to a new unit. 
5. **Always Tests**: Modify/Add `jest` unit tests immediately before or alongside feature files. Validate via `npm run test`.
6. **Update Changelog**: Place relevant updates into the **Changelog** section of `context.md`.
