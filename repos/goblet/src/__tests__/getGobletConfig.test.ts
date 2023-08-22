
import { Logger } from '@keg-hub/cli-utils';
import { addConfigFileTypes } from '../utils/addConfigFileTypes';
import { loadConfigFromBase } from '../loaders/loadConfigFromBase';
import { getDefaultGobletConfig } from '../getDefaultGobletConfig';
import { getGobletConfig, resetGobletConfig } from '../getGobletConfig'

jest.mock('@keg-hub/cli-utils');
jest.mock('./addConfigFileTypes');
jest.mock('./loadConfigFromBase');
jest.mock('./getDefaultGobletConfig');

describe('getGobletConfig', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    resetGobletConfig();
  });

  it('should return the cached config if it exists and not in a Jest worker', () => {
    process.env.JEST_WORKER_ID = 'worker1';
    const config = { someConfigProperty: 'value' };
    global.__GOBLET_CONFIG = config;

    const result = getGobletConfig();

    expect(result).toEqual(config);
    expect(loadConfigFromBase).not.toHaveBeenCalled();

    expect(addConfigFileTypes).not.toHaveBeenCalled();
    expect(getDefaultGobletConfig).not.toHaveBeenCalled();

    delete process.env.JEST_WORKER_ID;
    delete global.__GOBLET_CONFIG;
  });

  it('should load the default goblet.config and custom config and merge them', () => {
    const configFromBase = { baseConfigProperty: 'value' };
    const customConfig = { customConfigProperty: 'value' };
    const mergedConfig = { mergedConfigProperty: 'value' };
    const defaultConfig = { defaultConfigProperty: 'value' };
    const finalConfig = { finalConfigProperty: 'value' };
    // @ts-ignore
    loadConfigFromBase.mockReturnValue(configFromBase);
    // @ts-ignore
    loadCustomConfig.mockReturnValue(customConfig);
    // @ts-ignore
    addConfigFileTypes.mockReturnValue(mergedConfig);
    // @ts-ignore
    getDefaultGobletConfig.mockReturnValue(defaultConfig);

    const result = getGobletConfig();

    expect(result).toEqual(finalConfig);
    expect(loadConfigFromBase).toHaveBeenCalledWith(undefined);
    expect(addConfigFileTypes).toHaveBeenCalledWith(mergedConfig);
    expect(getDefaultGobletConfig).toHaveBeenCalled();
    expect(Logger.warn).not.toHaveBeenCalled();
    expect(Logger.pair).not.toHaveBeenCalled();
    expect(Logger.log).not.toHaveBeenCalled();
  });

  it('should warn and use default config if no custom config is found and `local` is true', () => {
    const configFromBase = { baseConfigProperty: 'value' };
    const mergedConfig = { mergedConfigProperty: 'value' };
    const defaultConfig = { defaultConfigProperty: 'value' };
    const finalConfig = { finalConfigProperty: 'value' };
    // @ts-ignore
    loadConfigFroBase.mockReturnValue(configFromBase);
    // @ts-ignore
    loadCustomConfig.mockReturnValue(undefined);
    // @ts-ignore
    addConfigFileTypes.mockReturnValue(mergedConfig);
    // @ts-ignore
    getDefaultGobletConfig.mockReturnValue(defaultConfig);
    Logger.colors = { red: jest.fn() };

    const result = getGobletConfig({ local: true, warn: true });

    expect(result).toEqual(finalConfig);
    expect(loadConfigFromBase).toHaveBeenCalledWith(undefined);
    expect(addConfigFileTypes).toHaveBeenCalledWith(mergedConfig);
    expect(getDefaultGobletConfig).toHaveBeenCalled();
    expect(Logger.warn).toHaveBeenCalledTimes(1);
    expect(Logger.pair).toHaveBeenCalledTimes(1);
    expect(Logger.log).toHaveBeenCalledTimes(2);
    expect(Logger.log).toHaveBeenCalledWith(
      expect.stringContaining('--config <path>')
    );
    expect(Logger.log).toHaveBeenCalledWith(
      expect.stringContaining('current working directory')
    );
  });
});

describe('resetGobletConfig', () => {
  it('should reset the cached goblet config', () => {
    global.__GOBLET_CONFIG = { someConfigProperty: 'value' };

    resetGobletConfig();

    expect(global.__GOBLET_CONFIG).toBeUndefined();
  });
});
