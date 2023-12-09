
import { Logger } from '@gobletqa/logger'
import { getGobletConfig } from '../getGobletConfig'
import { addConfigFileTypes } from '../utils/addConfigFileTypes'
import { loadConfigFromBase } from '../loaders/loadConfigFromBase'
import { getGobletCfg, resetGobletConfig } from '../loaders/configCache'

jest.mock('@gobletqa/logger')
jest.mock('../loaders/configCache')
jest.mock('../getDefaultGobletConfig')
jest.mock('../utils/addConfigFileTypes')
jest.mock('../loaders/loadConfigFromBase')

describe('getGobletConfig', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    resetGobletConfig()
  })

  it('should return the cached config if it exists and EXAM_ENV is not set', () => {
    const orgExEnv = process.env.EXAM_ENV
    delete process.env.EXAM_ENV

    const config = { someConfigProperty: 'value' }
    // @ts-ignore
    getGobletCfg.mockReturnValue({config})

    const result = getGobletConfig()

    expect(result).toEqual(config)
    expect(loadConfigFromBase).not.toHaveBeenCalled()

    expect(addConfigFileTypes).not.toHaveBeenCalled()

    if(orgExEnv) process.env.EXAM_ENV = orgExEnv
  })

  it('should load the goblet.config from the page', () => {
    const configFromBase = { baseConfigProperty: 'value' }
    // @ts-ignore
    loadConfigFromBase.mockReturnValue({ config: configFromBase})
    const result = getGobletConfig()

    expect(result).toEqual(configFromBase)
    expect(loadConfigFromBase).toHaveBeenCalledWith({})
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(Logger.pair).not.toHaveBeenCalled()
    expect(Logger.log).not.toHaveBeenCalled()
  })

  it(`should print a warning when args 'local' and 'wanr' is true`, () => {
    const configFromBase = { baseConfigProperty: 'value' }

    // @ts-ignore
    loadConfigFromBase.mockReturnValue({})
    // @ts-ignore
    Logger.colors = { red: jest.fn() }

    const result = getGobletConfig({ local: true, warn: true })

    expect(result).toEqual(undefined)
    expect(loadConfigFromBase).toHaveBeenCalledWith({ local: true, warn: true })

    expect(Logger.warn).toHaveBeenCalledTimes(2)
    expect(Logger.pair).toHaveBeenCalledTimes(1)
    expect(Logger.log).toHaveBeenCalledTimes(3)
    expect(Logger.log).toHaveBeenCalledWith(
      expect.stringContaining('--config <path>')
    )
    expect(Logger.log).toHaveBeenCalledWith(
      expect.stringContaining('current working directory')
    )
  })
})
