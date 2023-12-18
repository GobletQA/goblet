import { gobletLoader } from '../../loaders/loader'
import { configFromFolder } from '../../loaders/configFromFolder'

jest.mock(`../loader`)
jest.mock(`@gobletqa/environment/constants`)

describe(`configFromFolder`, () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it(`should iterate through the GobletConfigFileLocations and call gobletLoader for each location`, () => {
    const mockConfig = { /* mock config */ }
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(null)
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(null)
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(mockConfig)

    const result = configFromFolder(`/path/to/base`, { ref: `test/repo` })

    expect(result).toBe(mockConfig)
    expect(gobletLoader).toHaveBeenCalledTimes(3)
    expect(gobletLoader).toHaveBeenCalledWith({basePath: `/path/to/base`, ref: `test/repo`})
    expect(gobletLoader).toHaveBeenCalledWith({basePath: `/path/to/base/config`, ref: `test/repo`})
    expect(gobletLoader).toHaveBeenCalledWith({basePath: `/path/to/base/configs`, ref: `test/repo`})
  })

  it(`should return null if gobletLoader does not find a config in any location`, () => {
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(null)
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(null)
    // @ts-ignore
    gobletLoader.mockReturnValueOnce(null)

    const result = configFromFolder(`/path/to/base`, { ref: `test/repo` })

    expect(result).toBeUndefined()
    expect(gobletLoader).toHaveBeenCalledTimes(6)
    expect(gobletLoader).toHaveBeenCalledWith({basePath: `/path/to/base`, ref: `test/repo`})
    expect(gobletLoader).toHaveBeenCalledWith({basePath: `/path/to/base/config`, ref: `test/repo`})
    expect(gobletLoader).toHaveBeenCalledWith({basePath: `/path/to/base/configs`, ref: `test/repo`})
  })
})
