import path from 'path'
import { GBCRoot } from '../../resolveRoot'

jest.mock('../../resolveRoot')

describe('getDefaultGobletConfig', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('should require and merge the default goblet config only once', () => {
    const mockDefaultConfig = { paths: { root: `test` } }
    jest.doMock(
      path.join(GBCRoot, '../../', 'configs/goblet.default.config.js'),
      () => mockDefaultConfig
    )

    const { getDefaultGobletConfig } = require('../getDefaultGobletConfig')

    const result1 = getDefaultGobletConfig()
    const result2 = getDefaultGobletConfig()

    expect(result1).not.toBe(mockDefaultConfig)
    expect(result2).not.toBe(mockDefaultConfig)
    expect(result1).toEqual(mockDefaultConfig)
    expect(result2).toEqual(mockDefaultConfig)
  })
})
