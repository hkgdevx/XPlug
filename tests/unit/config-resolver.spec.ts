import { ConfigResolver } from '@core/config-resolver';
import { ConfigValidationError } from '@core/errors';
import { PluginDefinition } from '@core/types';

describe('Config Resolver (Duck-typing Execution)', () => {
  it('should merge defaults and overrides', () => {
    const p: PluginDefinition = { name: 'test', defaultConfig: { a: 1 } };
    const res = ConfigResolver.resolve(p, { b: 2 });
    expect(res).toEqual({ a: 1, b: 2 });
  });

  it('should evaluate functional strict schemas', () => {
    const p: PluginDefinition = {
      name: 'test',
      configSchema: (cfg: any) => {
        if (!cfg.passed) throw new Error('Missing passed flag');
      }
    };

    expect(() => ConfigResolver.resolve(p, {})).toThrow(ConfigValidationError);
    expect(() => ConfigResolver.resolve(p, { passed: true })).not.toThrow();
  });

  it('should evaluate zod-style schemas', () => {
    const mockZodSchema = {
      parse: (cfg: any) => {
        if (!cfg.zodPassed) throw new Error('Invalid object');
      }
    };

    const p: PluginDefinition = {
      name: 'test',
      configSchema: mockZodSchema
    };

    expect(() => ConfigResolver.resolve(p, {})).toThrow(ConfigValidationError);
    expect(() => ConfigResolver.resolve(p, { zodPassed: true })).not.toThrow();
  });
});
