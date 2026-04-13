import * as path from 'path';
import { PluginManager } from '@core/plugin-manager';
import { loadFromDir } from '../../src/discovery/load-from-dir';

describe('Discovery System', () => {
  it('should explicitly load default and named typescript exports from a directory', async () => {
    const manager = new PluginManager({ lifecycles: ['onBoot'] });
    const pluginDir = path.join(__dirname, '../fixtures/plugins');

    await loadFromDir(pluginDir, manager);

    const loaded = manager.listPlugins();

    expect(loaded).toContain('dummy-feature');
    expect(loaded).toContain('named-feature');
  });

  it('should explicitly throw an error if discovery dir goes missing', async () => {
    const manager = new PluginManager({ lifecycles: [] });
    await expect(loadFromDir('./fake_dir_123', manager)).rejects.toThrow(/Discovery directory not found/);
  });
});
