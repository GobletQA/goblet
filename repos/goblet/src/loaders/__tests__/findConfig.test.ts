import { findConfig } from '../findConfig'
import { configFromFolder } from '../configFromFolder'

jest.mock(`../loader`)
jest.mock(`@GSH/constants`)
jest.mock(`../configFromFolder`)


describe('findConfig', () => {

  beforeEach(() => {
    jest.resetAllMocks()
    process.cwd = jest.fn().mockReturnValue('/current/working/dir')
  })

  it(`should search for the config file starting from the current working directory upwards`, () => {
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
    expect(configFromFolder).toHaveBeenCalledWith(`/path/to/base`, {ref: `test/repo`})
    expect(configFromFolder).toHaveBeenCalledWith(`/path/to/`, {ref: `test/repo`})
    expect(configFromFolder).toHaveBeenCalledWith(`/path/`, {ref: `test/repo`})
  })

  it(`should search for the config file starting from the specified directory upwards`, () => {
    const mockConfig = { /* mock config */ }
    // @ts-ignore
    configFromFolder.mockReturnValueOnce(null)
    // @ts-ignore
    configFromFolder.mockReturnValueOnce(mockConfig)

    const result = findConfig(`/custom/start/dir`, { ref: `test/repo` })

    expect(result).toBe(mockConfig)
    expect(configFromFolder).toHaveBeenCalledTimes(2)
    expect(configFromFolder).toHaveBeenCalledWith(`/custom/start/dir`, { ref: `test/repo` })
    expect(configFromFolder).toHaveBeenCalledWith(`/custom/start/`, { ref: `test/repo` })
  })

  it(`should return null if the config file is not found in any directory`, () => {
    // @ts-ignore
    configFromFolder.mockReturnValue(null)

    const result = findConfig(`/custom/start/dir`, { ref: `test/repo` })

    expect(result).toBeNull()
    expect(configFromFolder).toHaveBeenCalledTimes(3)
    expect(configFromFolder).toHaveBeenCalledWith(`/custom/start/dir`, { ref: `test/repo` })
    expect(configFromFolder).toHaveBeenCalledWith(`/custom/start/`, { ref: `test/repo` })
    expect(configFromFolder).toHaveBeenCalledWith(`/custom/`, { ref: `test/repo` })
  })
})
