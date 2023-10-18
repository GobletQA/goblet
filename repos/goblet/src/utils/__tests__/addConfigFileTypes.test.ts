import { getFileTypes } from '../../utils/getFileTypes'
import { exists } from '@keg-hub/jsutils'
import { addConfigFileTypes } from '../addConfigFileTypes'

jest.mock('../utils/getFileTypes')
jest.mock('@keg-hub/jsutils')

describe('addConfigFileTypes', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return the config if it is falsy or does not have paths.repoRoot or fileTypes', () => {
    const config1 = null
    const config2 = {}
    const config3 = { paths: { repoRoot: '/path/to/repo' } }
    const config4 = { fileTypes: 'existing-fileTypes' }

    const result1 = addConfigFileTypes(config1)
    // @ts-ignore
    const result2 = addConfigFileTypes(config2)
    // @ts-ignore
    const result3 = addConfigFileTypes(config3)
    // @ts-ignore
    const result4 = addConfigFileTypes(config4)

    expect(result1).toBe(config1)
    expect(result2).toBe(config2)
    expect(result3).toBe(config3)
    expect(result4).toBe(config4)
    expect(getFileTypes).not.toHaveBeenCalled()
    expect(exists).not.toHaveBeenCalled()
  })

  it('should add fileTypes to the config if they do not exist', () => {
    const config = { paths: { repoRoot: '/path/to/repo' } }
    const fileTypes = { js: 'JavaScript', css: 'CSS' }
    // @ts-ignore
    getFileTypes.mockReturnValue(fileTypes)
    // @ts-ignore
    exists.mockReturnValue(false)
    // @ts-ignore
    const result = addConfigFileTypes(config)

    expect(result).toEqual({ paths: { repoRoot: '/path/to/repo' }, fileTypes })
    expect(getFileTypes).toHaveBeenCalledWith('/path/to/repo', config.paths)
    // @ts-ignore
    expect(exists).toHaveBeenCalledWith(config.fileTypes)
  })

  it('should not modify the config if fileTypes already exist', () => {
    const config = { paths: { repoRoot: '/path/to/repo' }, fileTypes: 'existing-fileTypes' }
    // @ts-ignore
    exists.mockReturnValue(true)

    // @ts-ignore
    const result = addConfigFileTypes(config)

    expect(result).toBe(config)
    expect(getFileTypes).not.toHaveBeenCalled()
    expect(exists).toHaveBeenCalledWith(config.fileTypes)
  })
})
