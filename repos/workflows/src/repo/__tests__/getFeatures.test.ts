import { Repo } from '../repo'
import { getFeatures } from '../getFeatures'
import { getDefinitions } from '../getDefinitions'
import { loadFeatures } from '@GSH/libs/features/features'

jest.mock('@GSH/libs/features/features')
jest.mock('@GSH/repo/getDefinitions')

describe('getFeatures', () => {
  let mockRepo: Repo
  let mockConfig: any
  let mockDefinitions: any
  let mockFeatures: any

  beforeEach(() => {
    // @ts-ignore
    mockRepo = { /* mock repo object */ }
    mockConfig = { /* mock goblet config */ }
    mockDefinitions = { /* mock definitions object */ }
    mockFeatures = { /* mock features object */ }
    // @ts-ignore
    getDefinitions.mockResolvedValue({ definitions: mockDefinitions })
    // @ts-ignore
    loadFeatures.mockResolvedValue(mockFeatures)
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('should call getDefinitions and loadFeatures with the provided repo and config', async () => {
    const result = await getFeatures(mockRepo, mockConfig)

    expect(result).toEqual({ features: mockFeatures, definitions: mockDefinitions })
    expect(getDefinitions).toHaveBeenCalledWith(mockRepo, mockConfig)
    expect(loadFeatures).toHaveBeenCalledWith(mockRepo)
  })
})
