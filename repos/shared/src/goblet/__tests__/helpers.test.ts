import path from 'path'
import { loader } from '@GSH/libs/loader'
import { GobletConfigFileNames } from '@GSH/constants'
import { configAtPath, configFromFolder, findConfig } from '../helpers'

jest.mock('@GSH/libs/loader')
jest.mock('@GSH/constants')

describe('configAtPath', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call loader with the correct parameters and return the loaded config', () => {
    const mockConfig = { /* mock config */ }
    // @ts-ignore
    loader.mockReturnValue(mockConfig)

    const result = configAtPath('/path/to/base')

    expect(result).toBe(mockConfig)
    expect(loader).toHaveBeenCalledWith({
      basePath: '/path/to/base',
      safe: true,
      first: true,
      merge: false,
      loadArr: GobletConfigFileNames,
    })
  })

  it('should set the repoRoot path in the config if it exists and is not set', () => {
    const mockConfig = {
      paths: {}
    }
    // @ts-ignore
    loader.mockReturnValue(mockConfig)

    const result = configAtPath('/path/to/base')

    expect(result).toBe(mockConfig)
    // @ts-ignore
    expect(mockConfig.paths.repoRoot).toBe('/path/to/base')
  })
})

describe('configFromFolder', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should iterate through the GobletConfigFileLocations and call configAtPath for each location', () => {
    const mockConfig = { /* mock config */ }
    // @ts-ignore
    configAtPath.mockReturnValueOnce(null)
    // @ts-ignore
    configAtPath.mockReturnValueOnce(null)
    // @ts-ignore
    configAtPath.mockReturnValueOnce(mockConfig)

    const result = configFromFolder('/path/to/base')

    expect(result).toBe(mockConfig)
    expect(configAtPath).toHaveBeenCalledTimes(3)
    expect(configAtPath).toHaveBeenCalledWith('/path/to/base/Goblet')
    expect(configAtPath).toHaveBeenCalledWith('/path/to/base')
    expect(configAtPath).toHaveBeenCalledWith('/path/to/base/.goblet')
  })

  it('should return null if configAtPath does not find a config in any location', () => {
    // @ts-ignore
    configAtPath.mockReturnValueOnce(null)
    // @ts-ignore
    configAtPath.mockReturnValueOnce(null)
    // @ts-ignore
    configAtPath.mockReturnValueOnce(null)

    const result = configFromFolder('/path/to/base')

    expect(result).toBeNull()
    expect(configAtPath).toHaveBeenCalledTimes(3)
    expect(configAtPath).toHaveBeenCalledWith('/path/to/base/Goblet')
    expect(configAtPath).toHaveBeenCalledWith('/path/to/base')
    expect(configAtPath).toHaveBeenCalledWith('/path/to/base/.goblet')
  })
})

describe('findConfig', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    process.cwd = jest.fn().mockReturnValue('/current/working/dir')
  })

  it('should search for the config file starting from the current working directory upwards', () => {
    const mockConfig = { /* mock config */ }
    // @ts-ignore
    configFromFolder.mockReturnValueOnce(null)
    // @ts-ignore
    configFromFolder.mockReturnValueOnce(null)
    // @ts-ignore
    configFromFolder.mockReturnValueOnce(mockConfig)

    const result = findConfig()

    expect(result).toBe(mockConfig)
    expect(configFromFolder).toHaveBeenCalledTimes(3)
    expect(configFromFolder).toHaveBeenCalledWith('/current/working/dir')
    expect(configFromFolder).toHaveBeenCalledWith('/current')
    expect(configFromFolder).toHaveBeenCalledWith('/')
  })

  it('should search for the config file starting from the specified directory upwards', () => {
    const mockConfig = { /* mock config */ }
    // @ts-ignore
    configFromFolder.mockReturnValueOnce(null)
    // @ts-ignore
    configFromFolder.mockReturnValueOnce(mockConfig)

    const result = findConfig('/custom/start/dir')

    expect(result).toBe(mockConfig)
    expect(configFromFolder).toHaveBeenCalledTimes(2)
    expect(configFromFolder).toHaveBeenCalledWith('/custom/start/dir')
    expect(configFromFolder).toHaveBeenCalledWith('/custom')
  })

  it('should return null if the config file is not found in any directory', () => {
    // @ts-ignore
    configFromFolder.mockReturnValue(null)

    const result = findConfig()

    expect(result).toBeNull()
    expect(configFromFolder).toHaveBeenCalledTimes(3)
    expect(configFromFolder).toHaveBeenCalledWith('/current/working/dir')
    expect(configFromFolder).toHaveBeenCalledWith('/current')
    expect(configFromFolder).toHaveBeenCalledWith('/')
  })
})
