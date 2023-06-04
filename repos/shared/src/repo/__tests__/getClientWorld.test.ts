

import { deepMerge } from '@keg-hub/jsutils/src/node'
import { getGobletConfig } from '@GSH/goblet/getGobletConfig'
import { getRepoGobletDir } from '@GSH/utils/getRepoGobletDir'
import { loaderSearch } from '@GSH/libs/loader'
import { DefWorld } from '@GSH/constants'
import { getClientWorld, loadClientWorld, setGobletEnv } from '../getClientWorld'

jest.mock('@GSH/goblet/getGobletConfig')
jest.mock('@GSH/utils/getRepoGobletDir')
jest.mock('@GSH/libs/loader')
jest.mock('@keg-hub/jsutils/src/node')

describe('setGobletEnv', () => {
  let orgGobletEnv: string | undefined
  let orgGobletBase: string | undefined

  beforeEach(() => {
    orgGobletEnv = process.env.GOBLET_ENV
    orgGobletBase = process.env.GOBLET_CONFIG_BASE
    jest.resetAllMocks()
    jest.resetModules()
  })

  afterEach(() => {
    if (orgGobletEnv) process.env.GOBLET_ENV = orgGobletEnv
    if (orgGobletBase) process.env.GOBLET_CONFIG_BASE = orgGobletBase
  })

  it('should overwrite GOBLET_ENV and GOBLET_CONFIG_BASE with values from the passed config', () => {
    const config = {
      environment: 'test',
      paths: {
        repoRoot: '/path/to/repo',
      },
    }

    // @ts-ignore
    const resetEnvs = setGobletEnv(config)

    expect(process.env.GOBLET_ENV).toBe('test')
    expect(process.env.GOBLET_CONFIG_BASE).toBe('/path/to/repo')

    resetEnvs()

    expect(process.env.GOBLET_ENV).toBe(orgGobletEnv)
    expect(process.env.GOBLET_CONFIG_BASE).toBe(orgGobletBase)
  })

  it('should not modify GOBLET_ENV and GOBLET_CONFIG_BASE if config does not have environment and paths', () => {
    // @ts-ignore
    const resetEnvs = setGobletEnv({})

    expect(process.env.GOBLET_ENV).toBe(orgGobletEnv)
    expect(process.env.GOBLET_CONFIG_BASE).toBe(orgGobletBase)

    resetEnvs()

    expect(process.env.GOBLET_ENV).toBe(orgGobletEnv)
    expect(process.env.GOBLET_CONFIG_BASE).toBe(orgGobletBase)
  })
})

describe('loadClientWorld', () => {
  let mockConfig: any
  let mockWorldJson: any
  let mockResetEnvs: jest.Mock

  beforeEach(() => {
    mockConfig = {
      paths: {
        world: '/path/to/world.json',
      },
    }
    mockWorldJson = { /* mock world.json content */ }
    mockResetEnvs = jest.fn()
    // @ts-ignore
    setGobletEnv.mockReturnValue(mockResetEnvs)
    // @ts-ignore
    loaderSearch.mockReturnValue(mockWorldJson)
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('should return the default world if worldPath is not defined', () => {
    const config = {
      paths: {},
    }

    // @ts-ignore
    const result = loadClientWorld(config)

    expect(result).toEqual(DefWorld)
    expect(setGobletEnv).not.toHaveBeenCalled()
    expect(loaderSearch).not.toHaveBeenCalled()
    expect(mockResetEnvs).not.toHaveBeenCalled()
  })

  it('should load and merge the world file from the specified path', () => {
    const result = loadClientWorld(mockConfig)

    expect(result).toEqual(deepMerge(DefWorld, mockWorldJson))
    expect(setGobletEnv).toHaveBeenCalledWith(mockConfig)
    expect(getRepoGobletDir).toHaveBeenCalledWith(mockConfig)
    expect(loaderSearch).toHaveBeenCalledWith({
      basePath: getRepoGobletDir(mockConfig),
      clearCache: true,
      file: 'world.json',
      location: '/path/to/world.json',
    })
    expect(mockResetEnvs).toHaveBeenCalled()
  })

  it('should handle errors during world file loading', () => {
    // @ts-ignore
    loaderSearch.mockImplementation(() => {
      throw new Error('Failed to load world file')
    })

    const result = loadClientWorld(mockConfig)

    expect(result).toEqual(deepMerge(DefWorld, mockWorldJson))
    expect(setGobletEnv).toHaveBeenCalledWith(mockConfig)
    expect(getRepoGobletDir).toHaveBeenCalledWith(mockConfig)
    expect(loaderSearch).toHaveBeenCalledWith({
      basePath: getRepoGobletDir(mockConfig),
      clearCache: true,
      file: 'world.json',
      location: '/path/to/world.json',
    })
    expect(mockResetEnvs).toHaveBeenCalled()
    // Expect additional error handling logic
    expect(console.log).toHaveBeenCalled()
  })
})

describe('getClientWorld', () => {
  let mockGobletConfig: any
  let mockRepoGobletConfig: any
  let mockLoadClientWorld: jest.Mock

  beforeEach(() => {
    mockGobletConfig = { /* mock goblet config */ }
    mockRepoGobletConfig = { /* mock repo goblet config */ }
    // @ts-ignore
    getGobletConfig.mockReturnValue(mockGobletConfig)
    // @ts-ignore
    loadClientWorld.mockReturnValue(mockRepoGobletConfig)
    mockLoadClientWorld = loadClientWorld as jest.Mock
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('should call loadClientWorld with the default goblet config', () => {
    const result = getClientWorld()

    expect(result).toBe(mockRepoGobletConfig)
    expect(getGobletConfig).toHaveBeenCalled()
    expect(mockLoadClientWorld).toHaveBeenCalledWith(mockGobletConfig)
  })

  it('should call loadClientWorld with the passed repo goblet config', () => {
    const result = getClientWorld(mockGobletConfig)

    expect(result).toBe(mockRepoGobletConfig)
    expect(getGobletConfig).not.toHaveBeenCalled()
    expect(mockLoadClientWorld).toHaveBeenCalledWith(mockGobletConfig)
  })
})
