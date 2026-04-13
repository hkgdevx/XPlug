#!/usr/bin/env node

/**
 * @file index.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

import * as fs from 'fs';
import * as path from 'path';

const command = process.argv[2];
const pluginName = process.argv[3] || 'my-xplug-feature';

if (command === 'new') {
  const dirPath = path.resolve(process.cwd(), pluginName);

  if (fs.existsSync(dirPath)) {
    console.error(`Error: Directory '${pluginName}' already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(dirPath, { recursive: true });

  const template = `import { definePlugin } from 'xplug';

export default definePlugin({
  name: '${pluginName}',
  version: '1.0.0',
  description: 'A newly generated XPlug feature module',
  hooks: {
    'onBoot': (ctx) => {
      ctx.logger.info('[' + ctx.plugin.name + '] Booting up!');
    }
  }
});
`;

  fs.writeFileSync(path.join(dirPath, 'index.ts'), template, 'utf8');
  console.log(`Successfully scaffolded XPlug capability at ./${pluginName}/index.ts`);
} else {
  console.log(`Usage: xplug new <plugin-name>`);
}
