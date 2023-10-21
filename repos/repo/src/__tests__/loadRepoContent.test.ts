import { Logger } from '@keg-hub/cli-utils'

import { loadFeatures } from '@GSH/libs/features/features'
import { buildFileTree } from '@GSH/libs/fileSys/fileTree'
import { loadDefinitions } from '@GSH/libs/definitions/definitions'
import { fileModelArrayToObj } from '@GSH/models/fileModelArrayToObj'
import { loadRepoContent } from '../loadRepoContent'

jest.mock('@GSH/libs/features/features')
jest.mock('@GSH/libs/fileSys/fileTree')
jest.mock('@GSH/libs/definitions/definitions')
jest.mock('@GSH/utils/fileModelArrayToObj')
jest.mock('@keg-hub/cli-utils')

describe('loadRepoContent', () => {
  let mockRepo: any
  let mockConfig: any
  let mockStatus: any
  let mockContent: any
  let mockFeatures: any
  let mockDefinitions: any
  let mockFileTree: any

  beforeEach(() => {
    // @ts-ignore
    mockRepo = { /* mock repo object */ }
    mockConfig = { /* mock goblet config */ }
    mockStatus = { /* mock repo mount status */ }
    mockContent = { /* mock repo content object */ }
    mockFeatures = { /* mock features object */ }
    mockDefinitions = { /* mock definitions object */ }
    mockFileTree = { /* mock file tree object */ }
    // @ts-ignore
    loadFeatures.mockResolvedValue(mockFeatures)
    // @ts-ignore
    buildFileTree.mockResolvedValue(mockFileTree)
    // @ts-ignore
    loadDefinitions.mockResolvedValue(mockDefinitions)
    // @ts-ignore
    fileModelArrayToObj.mockImplementation((fileModels) => fileModels)
    Logger.warn.mockImplementation(() => {})
    Logger.error.mockImplementation(() => {})
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('should load repo content successfully', async () => {
    const result = await loadRepoContent(mockRepo, mockStatus)

    expect(result).toEqual(mockContent)
    expect(loadFeatures).toHaveBeenCalledWith(mockRepo)
    expect(buildFileTree).toHaveBeenCalledWith(mockRepo)
    expect(loadDefinitions).toHaveBeenCalledWith(mockRepo, mockConfig)
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
