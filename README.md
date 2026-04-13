# XPlug

> The deterministic, zero-dependency lifecycle-driven framework for mapping sprawling Express backend ecosystems safely natively via Plugins.

[![npm version](https://img.shields.io/npm/v/xplug.svg?style=flat)](https://www.npmjs.com/package/xplug)
[![Build Status](https://img.shields.io/travis/your-repo/xplug.svg?style=flat)](https://travis-ci.org/your-repo/xplug)

XPlug solves the problem of "Framework Rot" where massive Express applications slowly drift into tightly coupled balls of mud. Rather than explicitly writing global routing configurations, Database initialization logic, and Auth layers into one sequential `index.ts` file — XPlug forces your developers to bundle logic into self-containing **Plugins**. 

XPlug natively verifies their dependency structures (e.g., throwing a Hard Crash if Auth tries to load before Database), merges configuration schemas dynamically, and triggers isolated lifecycles synchronously across all extensions securely.

## Core Features 

- **Topological Sorting**: Explicitly declare string arrays inside `dependencies` and `optionalDependencies` and XPlug builds a flawless structural Directed Acyclic Graph (DAG) before `onBoot` runs to ensure features load strictly deterministically.
- **Duck-Typed Configuration Assertions**: Merge default parameters securely via Native Runtime checks (using Zod or Joi schemas locally) to enforce that host applications pass strictly configured properties down to plugins.
- **Custom App Lifecycles**: Emit domain events seamlessly like `.emit('onOrderCreated', orderPayload)` and allow downstream third-party plugins to execute arbitrary Hooks precisely responding to application traffic.
- **Express Route/Middleware Adapters**: Hook directly into Express `mountRoutes` mapping API endpoints uniformly with fallback default `routeBasePath`s resolving overlaps dynamically.

## Documentation Index 

The `/docs` directory is explicitly crafted outlining the API parameters exhaustively to learn the core modules:

1. [Architecture Overview](./docs/overview.md) *(Start here!)*
2. [Plugin Manager](./docs/plugin-manager.md)
3. [Lifecycle Registry](./docs/lifecycle-registry.md)
4. [Filesystem Discovery & Diagnostics](./docs/discovery_and_diagnostics.md)
5. [CLI Scaffolding](./docs/cli-scaffolding.md)
6. [Express Integrations](./docs/express-adapter.md)

## Example Host Application

```typescript
import express from 'express';
import { createPluginSystem } from 'xplug';
import { authPlugin } from './plugins/auth';
import { databasePlugin } from './plugins/db';

const app = express();

/** Bind XPlug Engine strictly allocating Allowed lifecycles */
const system = createPluginSystem({
 app,
 lifecycles: ['onDatabaseBoot', 'onAuthBoot', 'beforeListen']
});

system.register(authPlugin);
system.register(databasePlugin);

async function start() {
 // 1. Dependency resolver confirms Auth loads after DB.
 await system.init(); 

 // 2. Safely triggers respective Lifecycle phases
 await system.runLifecycle('onDatabaseBoot');
 await system.runLifecycle('onAuthBoot');

 // 3. Mounts the combined isolated Router endpoints dynamically!
 await system.mountRoutes();

 app.listen(3000, () => {
 console.log("Modular Host Framework booted seamlessly!");
 });
}
start();
```

## Roadmap

1. **Phase 1 [Complete]**: Core Execution Engine
2. **Phase 2 [Complete]**: Express Framework Integration
3. **Phase 3 [Complete]**: Strict Typings / Errors
4. **Phase 4 [Complete]**: Filesystem Discovery
5. **Phase 5 [Complete]**: Schema Configurations
6. **Phase 6 [Complete]**: Dashboards, Sandboxes, & Toggles
7. **Production Roadmap**: `fastify` framework adapter layers, Browser-based dynamic GUI debugging plugins, and remote CDN plugin registry polling.
