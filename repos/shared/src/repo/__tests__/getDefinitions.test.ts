import { Repo } from '../repo'
import { loadDefinitions } from '@GSH/libs/definitions/definitions'
import { getDefinitions } from '../getDefinitions'

jest.mock('@GSH/libs/definitions/definitions')

describe('getDefinitions', () => {
  let mockRepo: Repo
  let mockConfig: any
  let mockDefinitions: any

  beforeEach(() => {
    // @ts-ignore
    mockRepo = { /* mock repo object */ }
    mockConfig = { /* mock goblet config */ }
    mockDefinitions = { /* mock definitions object */ }
    // @ts-ignore
    loadDefinitions.mockResolvedValue(mockDefinitions)
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('should call loadDefinitions with the provided repo, config, and cache parameters', async () => {
    const cache = true

    const result = await getDefinitions(mockRepo, mockConfig, cache)

    expect(result).toEqual({ definitions: mockDefinitions })
    expect(loadDefinitions).toHaveBeenCalledWith(mockRepo, mockConfig, cache)
  })

  it('should call loadDefinitions with the default cache value if not provided', async () => {
    const result = await getDefinitions(mockRepo, mockConfig)

    expect(result).toEqual({ definitions: mockDefinitions })
    expect(loadDefinitions).toHaveBeenCalledWith(mockRepo, mockConfig, true)
  })
})
