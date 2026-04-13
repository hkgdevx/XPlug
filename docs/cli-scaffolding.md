# Scaffolding Plugin Repositories CLI

If you are expanding your organization's backend framework to operate through XPlug, initializing dozens of folders manually to formulate your architecture is tedious. 

XPlug natively ships with a compiled binary you can leverage directly within your active NPX ecosystem for scaffolding compliant plugins immediately!

## `xplug new` Generator

To construct a beautifully structured, template-accurate plugin implementation out-of-the-box, simply trigger the generator specifying your intended domain scope.

### Invoking Scaffolding
```bash
npx xplug new analytics-tooling
```

### Outputs
XPlug will recursively map a local sub-directory and dump all boilerplate imports securely ensuring you have the baseline to write typesafe Hooks immediately:
```ts
// ./analytics-tooling/index.ts
import { definePlugin } from 'xplug';

export default definePlugin({
  name: 'analytics-tooling',
  version: '1.0.0',
  description: 'A newly generated XPlug feature module',
  hooks: {
    'onBoot': (ctx) => {
      ctx.logger.info('[' + ctx.plugin.name + '] Booting up!');
    }
  }
});
```
