import path from 'path'
import { buildFileModel } from '../buildFileModel'

jest.mock('fs')

describe('buildFileModel', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const mockRepo = {
    fileTypes: ['txt', 'jpg'],
    paths: {
      repoRoot: '/path/to/repo',
    },
  } as unknown as any

  it('should build a fileModel for a file', async () => {
    const data = {
      location: '/path/to/file.txt',
      uuid: '123',
      fileType: undefined,
    }
    const expectedFileModel = {
      name: 'file.txt',
      fileType: 'txt',
      uuid: '/path/to/file.txt',
      location: '/path/to/file.txt',
      mime: 'text/plain',
      ext: 'txt',
      relative: '/path/to/file.txt',
    }
    // @ts-ignore
    mime.types = { txt: 'text/plain' }
    path.extname = jest.fn(() => '.txt')

    const result = await buildFileModel(data, mockRepo)

    expect(result).toEqual(expectedFileModel)
    expect(path.extname).toHaveBeenCalledWith(data.location)

  })

  it('should build a fileModel for a folder', async () => {
    const data = {
      location: '/path/to/folder/',
      uuid: '456',
      fileType: undefined,
    }
    const expectedFileModel = {
      name: 'folder',
      fileType: 'folder',
      uuid: '/path/to/folder/',
      location: '/path/to/folder/',
      mime: 'text/plain',
      ext: '',
      relative: '/path/to/folder/',
    }
    // @ts-ignore
    mime.types = { '': 'text/plain' }
    path.extname = jest.fn(() => '')

    const result = await buildFileModel(data, mockRepo)

    expect(result).toEqual(expectedFileModel)
    expect(path.extname).toHaveBeenCalledWith(data.location)
  })
})
