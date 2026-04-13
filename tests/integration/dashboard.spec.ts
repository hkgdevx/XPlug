import request from 'supertest';
import express from 'express';
import { PluginManager } from '@core/plugin-manager';
import { expressPluginDashboard } from '@express/dashboard';

describe('Express Dashboard Analytics', () => {
  it('should return valid JSON metrics including plugins and telemetry loops', async () => {
    const manager = new PluginManager({ lifecycles: ['onBoot'] });

    // Register test plugin enabling default config properties silently
    manager.register({
      name: 'metrics-plugin',
      hooks: {
        onBoot: () => {}
      }
    });

    await manager.init();
    await manager.runLifecycle('onBoot'); // Populate some telemetry

    const app = express();
    app.use('/dashboard', expressPluginDashboard(manager));

    const response = await request(app).get('/dashboard/diagnostics');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.initializedPlugins).toContain('metrics-plugin');

    // Assert duration payload pushes appropriately
    const telemetry = response.body.data.telemetry;
    expect(Array.isArray(telemetry)).toBe(true);
    expect(telemetry.some((t: any) => t.pluginName === 'metrics-plugin' && t.lifecycle === 'onBoot')).toBe(true);
  });
});
