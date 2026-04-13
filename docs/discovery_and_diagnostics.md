# Discovery and Diagnostics

## Filesystem Loading

XPlug provides the `loadFromDir(absolutePath, pluginManager)` utility out of the box so that host systems do not have to statically import dozens of core features or plugin packages. Simply provide an absolute path, and XPlug will recursively verify ES default exports matching the `PluginDefinition` construct.

## Priorities and Load Sorting

XPlug guarantees topological sorting bounded strictly by plugin definitions (`dependencies`).
However, for internal arrays of Hooks assigned to the same plugin bound to the same lifecycle, you can define priority directly using object formats to break ties explicitly so that critical configurations operate tightly:

```typescript
export default definePlugin({
  name: 'core',
  hooks: {
    'onBoot': [
      { handler: () => console.log("I run second"), priority: 0 },
      { handler: () => console.log("I run first!!"), priority: 10 }
    ]
  }
})
```

## Diagnostics

During `.runLifecycle` execution sequences within `PluginManager`, XPlug attempts to parse the logger instance out of the transient `PluginContext`. If `ctx.logger.debug` exists, it will securely trace out timing duration logs matching specifically against execution bottlenecks!
