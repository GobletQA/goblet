import { gobletLoader } from '../../loaders/loader'
import { findConfig } from '../../loaders/findConfig'
import { configFromFolder } from '../../loaders/configFromFolder'

jest.mock('../../loaders/loader')
jest.mock('@GSH/constants')

describe('configFromFolder', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should iterate through the GobletConfigFileLocations and call gobletLoader for each location', () => {
    const mockConfig = { /* mock config */ }
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(null)
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(null)
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(mockConfig)

    const result = configFromFolder('/path/to/base', { ref: `test/repo` })

    expect(result).toBe(mockConfig)
    expect(gobletLoader).toHaveBeenCalledTimes(3)
    expect(gobletLoader).toHaveBeenCalledWith('/path/to/base/Goblet')
    expect(gobletLoader).toHaveBeenCalledWith('/path/to/base')
    expect(gobletLoader).toHaveBeenCalledWith('/path/to/base/.goblet')
  })

  it('should return null if gobletLoader does not find a config in any location', () => {
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(null)
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(null)
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(null)

    const result = configFromFolder('/path/to/base', { ref: `test/repo` })

    expect(result).toBeNull()
    expect(gobletLoader).toHaveBeenCalledTimes(3)
    expect(gobletLoader).toHaveBeenCalledWith('/path/to/base/Goblet')
    expect(gobletLoader).toHaveBeenCalledWith('/path/to/base')
    expect(gobletLoader).toHaveBeenCalledWith('/path/to/base/.goblet')
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

    const result = findConfig(`/path/to/base`, { ref: `test/repo` })

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

    const result = findConfig('/custom/start/dir', { ref: `test/repo` })

    expect(result).toBe(mockConfig)
    expect(configFromFolder).toHaveBeenCalledTimes(2)
    expect(configFromFolder).toHaveBeenCalledWith('/custom/start/dir')
    expect(configFromFolder).toHaveBeenCalledWith('/custom')
  })

  it('should return null if the config file is not found in any directory', () => {
    // @ts-ignore
    configFromFolder.mockReturnValue(null)

    const result = findConfig('/custom/start/dir', { ref: `test/repo` })

    expect(result).toBeNull()
    expect(configFromFolder).toHaveBeenCalledTimes(3)
    expect(configFromFolder).toHaveBeenCalledWith('/current/working/dir')
    expect(configFromFolder).toHaveBeenCalledWith('/current')
    expect(configFromFolder).toHaveBeenCalledWith('/')
  })
})
