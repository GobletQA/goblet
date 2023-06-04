import path from 'path'
import { GSHRoot } from '../../../resolveRoot'
import { deepMerge } from '@keg-hub/jsutils'
import { getDefaultGobletConfig } from '../getDefaultGobletConfig'

jest.mock('../../../resolveRoot')
jest.mock('@keg-hub/jsutils')

describe('getDefaultGobletConfig', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('should require and merge the default goblet config only once', () => {
    const mockDefaultConfig = { /* mock default config */ }
    jest.doMock(
      path.join(GSHRoot, '../../', 'configs/goblet.default.config.js'),
      () => mockDefaultConfig
    )

    const { getDefaultGobletConfig } = require('../getDefaultGobletConfig')

    const result1 = getDefaultGobletConfig()
    const result2 = getDefaultGobletConfig()

    expect(result1).toBe(mockDefaultConfig)
    expect(result2).toBe(mockDefaultConfig)
    expect(deepMerge).toHaveBeenCalledTimes(1)
    expect(deepMerge).toHaveBeenCalledWith(mockDefaultConfig)
  })
})
