

import fs from 'fs'
import { Logger } from '@gobletqa/logger'

const mockConfig = {}
const mockFindConfig = jest.fn(() => (mockConfig))
jest.setMock(`../findConfig`, {
  findConfig: mockFindConfig
})


jest.mock('fs')
jest.mock('@gobletqa/logger')
jest.mock('../../utils/helpers')
let orgWarn = Logger.warn

const { loadConfigFromBase } = require('../loadConfigFromBase')


describe(`loadConfigFromBase`, () => {
  
  beforeAll(() => {
    Logger.warn = jest.fn()
  })
  
  afterAll(() => {
    Logger.warn = orgWarn
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it(`should return null if the base path is not provided`, () => {
    // @ts-ignore
    const result = loadConfigFromBase({ base: ''})
    expect(result).toBeNull()

    expect(fs.existsSync).not.toHaveBeenCalled()
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(mockFindConfig).not.toHaveBeenCalled()
  })

  it(`should return null and log a warning if the base path does not exist`, () => {

    // @ts-ignore
    fs.existsSync.mockReturnValue(false)
    const result = loadConfigFromBase({base: `/path/to/non-existent`})

    expect(result).toBeNull()
    expect(fs.existsSync).toHaveBeenCalledWith(`/path/to/non-existent`)

    expect(Logger.warn).toHaveBeenCalledTimes(1)
    expect(Logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(`Goblet config folder /path/to/non-existent does not exist`)
    )
    expect(mockFindConfig).not.toHaveBeenCalled()

  })

  it(`should return the result of findConfig if the base path exists`, () => {
    // @ts-ignore
    fs.existsSync.mockReturnValue(true)
    // @ts-ignore
    fs.lstatSync.mockReturnValue({
      isDirectory: jest.fn(() => true),
      isSymbolicLink: jest.fn(() => false)
    })

    mockFindConfig.mockReturnValue(`config-file-path`)

    const result = loadConfigFromBase({ base: `/path/to/existent`})

    expect(result).toBe(`config-file-path`)
    expect(fs.existsSync).toHaveBeenCalledWith(`/path/to/existent`)
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(mockFindConfig).toHaveBeenCalledWith(`/path/to/existent`, {remote: undefined})
  })

  it(`should return the result of findConfig if the base path is a directory or symbolic link`, () => {
    // @ts-ignore
    fs.existsSync.mockReturnValue(true)
    // @ts-ignore
    // @ts-ignore
    fs.lstatSync.mockReturnValue({
      isDirectory: jest.fn(() => true),
      isSymbolicLink: jest.fn(() => false)
    })
    // @ts-ignore
    mockFindConfig.mockReturnValue(`config-file-path`)

    const result = loadConfigFromBase({ base: `/path/to/existent`})

    expect(result).toBe(`config-file-path`)
    expect(fs.existsSync).toHaveBeenCalledWith(`/path/to/existent`)
    expect(fs.lstatSync).toHaveBeenCalledWith(`/path/to/existent`)
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(mockFindConfig).toHaveBeenCalledWith(`/path/to/existent`, {remote: undefined})
  })

  it(`should return the result of findConfig if the base path is a symbolic link and GOBLET_RUN_FROM_CI is set`, () => {
    // @ts-ignore
    fs.existsSync.mockReturnValue(true)
    // @ts-ignore
    fs.lstatSync.mockReturnValue({
      isDirectory: jest.fn(() => false),
      isSymbolicLink: jest.fn(() => false)
    })
    process.env.GOBLET_RUN_FROM_CI = `true`

    mockFindConfig.mockReturnValue(`config-file-path`)

    const result = loadConfigFromBase({ base: `/path/to/existent`})

    expect(result).toBe(`config-file-path`)
    expect(fs.existsSync).toHaveBeenCalledWith(`/path/to/existent`)
    expect(fs.lstatSync).toHaveBeenCalledWith(`/path/to/existent`)
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(mockFindConfig).toHaveBeenCalledWith(`/path/to`, {remote: undefined})
  })
})
