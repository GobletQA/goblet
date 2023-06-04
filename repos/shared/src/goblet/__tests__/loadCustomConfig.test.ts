import path from 'path'
import { findConfig } from '../helpers'
import { isStr } from '@keg-hub/jsutils'
import { loadFromType } from '@GSH/libs/loader'
import { loadCustomConfig } from '../loadCustomConfig'

jest.mock('./helpers')
jest.mock('@keg-hub/jsutils')
jest.mock('@GSH/libs/loader')

describe('loadCustomConfig', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should load custom config from the specified path', () => {
    const configPath = 'custom-config-path'
    const customConfig = { someConfigProperty: 'value' }
    // @ts-ignore
    isStr.mockReturnValue(true)
    process.env.GOBLET_CONFIG_PATH = configPath
    // @ts-ignore
    path.resolve.mockReturnValue(configPath)
    // @ts-ignore
    require.cache[configPath] = 'cached-config'
    // @ts-ignore
    require.mockReturnValue(customConfig)
    // @ts-ignore
    loadFromType.mockReturnValue('loaded-config')

    const result = loadCustomConfig(configPath, true)

    expect(result).toEqual('loaded-config')
    expect(isStr).toHaveBeenCalledWith(configPath)
    expect(path.resolve).toHaveBeenCalledWith(configPath)
    expect(require.cache[configPath]).toBeUndefined()
    expect(require).toHaveBeenCalledWith(configPath)
    expect(loadFromType).toHaveBeenCalledWith(customConfig)

    delete process.env.GOBLET_CONFIG_PATH
  })

  it('should load custom config from the environment variable', () => {
    const configPath = 'custom-config-path'
    const customConfig = { someConfigProperty: 'value' }
    // @ts-ignore
    isStr.mockReturnValue(false)
    process.env.GOBLET_CONFIG_PATH = configPath
    // @ts-ignore
    path.resolve.mockReturnValue(configPath)
    // @ts-ignore
    require.cache[configPath] = 'cached-config'
    // @ts-ignore
    require.mockReturnValue(customConfig)
    // @ts-ignore
    loadFromType.mockReturnValue('loaded-config')

    const result = loadCustomConfig(undefined, true)

    expect(result).toEqual('loaded-config')
    expect(isStr).toHaveBeenCalledWith(undefined)
    expect(path.resolve).toHaveBeenCalledWith(configPath)
    expect(require.cache[configPath]).toBeUndefined()
    expect(require).toHaveBeenCalledWith(configPath)
    expect(loadFromType).toHaveBeenCalledWith(customConfig)

    delete process.env.GOBLET_CONFIG_PATH
  })

  it('should return undefined if configPath is not specified and search is false', () => {
    const result = loadCustomConfig(undefined, false)

    expect(result).toBeUndefined()
    expect(isStr).not.toHaveBeenCalled()
    expect(path.resolve).not.toHaveBeenCalled()
    expect(require.cache).toEqual({})
    expect(require).not.toHaveBeenCalled()
    expect(loadFromType).not.toHaveBeenCalled()
  })

  it('should return undefined if an error occurs and configPath is not specified', () => {
    const searchConfig = { someConfigProperty: 'value' }
    const findConfigPath = 'find-config-path'
    // @ts-ignore
    findConfig.mockReturnValue(findConfigPath)
    // @ts-ignore
    isStr.mockReturnValue(false)
    // @ts-ignore
    path.resolve.mockReturnValue(findConfigPath)
    // @ts-ignore
    require.cache[findConfigPath] = 'cached-config'
    // @ts-ignore
    require.mockImplementation(() => {
      throw new Error('Custom config error')
    })

    const result = loadCustomConfig(undefined, true)

    expect(result).toBeUndefined()
    expect(isStr).toHaveBeenCalledWith(undefined)
    expect(path.resolve).toHaveBeenCalledWith(findConfigPath)
    expect(require.cache[findConfigPath]).toBeUndefined()
    expect(require).toHaveBeenCalledWith(findConfigPath)
    expect(loadFromType).not.toHaveBeenCalled()
  })
})
