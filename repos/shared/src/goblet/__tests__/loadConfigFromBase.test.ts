

import fs from 'fs'
import path from 'path'
import { findConfig } from '../helpers'
import { Logger } from '@keg-hub/cli-utils'
import { loadConfigFromBase } from '../loadConfigFromBase'

jest.mock('fs')
jest.mock('../helpers')
jest.mock('@keg-hub/cli-utils')

describe('loadConfigFromBase', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(console, 'trace').mockImplementation(() => {})
  })

  it('should return null if the base path is not provided', () => {
    const result = loadConfigFromBase('')

    expect(result).toBeNull()
    expect(fs.existsSync).not.toHaveBeenCalled()
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(console.trace).not.toHaveBeenCalled()
    expect(findConfig).not.toHaveBeenCalled()
  })

  it('should return null and log a warning if the base path does not exist', () => {
    // @ts-ignore
    fs.existsSync.mockReturnValue(false)

    const result = loadConfigFromBase('/path/to/non-existent')

    expect(result).toBeNull()
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/non-existent')
    expect(Logger.warn).toHaveBeenCalledTimes(1)
    expect(Logger.warn).toHaveBeenCalledWith(expect.stringContaining('The base path does not exist'))
    expect(console.trace).toHaveBeenCalledTimes(1)
    expect(findConfig).not.toHaveBeenCalled()
  })

  it('should return the result of findConfig if the base path exists', () => {
    // @ts-ignore
    fs.existsSync.mockReturnValue(true)
    // @ts-ignore
    findConfig.mockReturnValue('config-file-path')

    const result = loadConfigFromBase('/path/to/existent')

    expect(result).toBe('config-file-path')
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/existent')
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(console.trace).not.toHaveBeenCalled()
    expect(findConfig).toHaveBeenCalledWith('/path/to/existent')
  })

  it('should return the result of findConfig if the base path is a directory or symbolic link', () => {
    // @ts-ignore
    fs.existsSync.mockReturnValue(true)
    // @ts-ignore
    fs.lstatSync.mockReturnValue({ isDirectory: () => true })
    // @ts-ignore
    findConfig.mockReturnValue('config-file-path')

    const result = loadConfigFromBase('/path/to/existent')

    expect(result).toBe('config-file-path')
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/existent')
    expect(fs.lstatSync).toHaveBeenCalledWith('/path/to/existent')
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(console.trace).not.toHaveBeenCalled()
    expect(findConfig).toHaveBeenCalledWith('/path/to/existent')
  })

  it('should return the result of findConfig if the base path is a symbolic link and GOBLET_RUN_FROM_CI is set', () => {
    // @ts-ignore
    fs.existsSync.mockReturnValue(true)
    // @ts-ignore
    fs.lstatSync.mockReturnValue({ isDirectory: () => false })
    process.env.GOBLET_RUN_FROM_CI = 'true'
    // @ts-ignore
    findConfig.mockReturnValue('config-file-path')

    const result = loadConfigFromBase('/path/to/existent')

    expect(result).toBe('config-file-path')
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/existent')
    expect(fs.lstatSync).toHaveBeenCalledWith('/path/to/existent')
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(console.trace).not.toHaveBeenCalled()
    expect(findConfig).toHaveBeenCalledWith('/path')
  })
})
