import fs from 'fs'
import path from 'path'
import mime from 'mime'
import {Repo} from '@gobletqa/repo/repo'
import { getLastModified } from '../getLastModified'

jest.mock('fs')
jest.mock('mime')

describe('getLastModified', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return the mtimeMs when metaData exists', async () => {
    const filePath = 'path/to/file.txt'
    const statResult = { mtimeMs: 1625184000000 }
    // @ts-ignore
    fs.stat.mockImplementation((_, cb) => cb(null, statResult))

    const result = await getLastModified(filePath)

    expect(fs.stat).toHaveBeenCalledWith(filePath, expect.any(Function))
    expect(result).toEqual(statResult.mtimeMs)
  })

  it('should return the current time when metaData is null', async () => {
    const filePath = 'path/to/non-existing-file.txt'
    // @ts-ignore
    fs.stat.mockImplementation((_, cb) => cb(new Error('File not found')))

    const result = await getLastModified(filePath)

    expect(fs.stat).toHaveBeenCalledWith(filePath, expect.any(Function))
    expect(result).toEqual(expect.any(Number))
  })
})
