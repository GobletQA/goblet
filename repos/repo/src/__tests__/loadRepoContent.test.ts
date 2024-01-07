import { Logger } from '@gobletqa/logger'

import {
  loadFeatures,
  buildFileTree,
  loadDefinitions,
  fileModelArrayToObj,
} from '@gobletqa/shared/fs'

import { loadRepoContent } from '../loadRepoContent'

jest.mock('@gobletqa/logger')
jest.mock('@keg-hub/cli-utils')
jest.mock('@gobletqa/shared/fs')

describe('loadRepoContent', () => {
  let mockWorld: any
  let mockRepo: any
  let mockConfig: any
  let mockStatus: any
  let mockContent: any
  let mockFeatures: any
  let mockDefinitions: any
  let mockFileTree: any

  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()

    mockWorld = {}
    mockConfig = {}
    mockStatus = {}
    mockFeatures = {}
    mockFileTree = {}
    mockDefinitions = {}
    mockRepo = { world: mockWorld }

    mockContent = {
      repo: mockRepo,
      status: mockStatus,
      features: mockFeatures,
      fileTree: mockFileTree,
      definitions: mockDefinitions,
    }
    // @ts-ignore
    loadFeatures.mockResolvedValue(mockFeatures)
    // @ts-ignore
    buildFileTree.mockResolvedValue(mockFileTree)
    // @ts-ignore
    loadDefinitions.mockResolvedValue(mockDefinitions)
    // @ts-ignore
    fileModelArrayToObj.mockImplementation((fileModels) => fileModels)
    // @ts-ignore
    Logger.warn.mockImplementation(() => {})
    // @ts-ignore
    Logger.error.mockImplementation(() => {})

  })

  it('should load repo content successfully', async () => {
    const result = await loadRepoContent(mockRepo, mockStatus)

    expect(result).toEqual(mockContent)
    expect(loadFeatures).toHaveBeenCalledWith(mockRepo)
    expect(buildFileTree).toHaveBeenCalledWith(mockRepo)
    expect(loadDefinitions).toHaveBeenCalledWith(mockRepo)
    expect(fileModelArrayToObj).toHaveBeenCalledWith(mockFeatures)
    expect(fileModelArrayToObj).toHaveBeenCalledWith(mockDefinitions)
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(Logger.error).not.toHaveBeenCalled()
  })

  it('should log an error and re-throw if an error occurs during content loading', async () => {
    const mockError = new Error('Content loading error')
    // @ts-ignore
    buildFileTree.mockRejectedValue(mockError)

    await expect(loadRepoContent(mockRepo, mockStatus)).rejects.toThrow(mockError)

    expect(Logger.warn).toHaveBeenCalledWith('[Repo Content Error] Could not load repo content files...')
    expect(Logger.error).toHaveBeenCalledWith(mockError)
  })
})
