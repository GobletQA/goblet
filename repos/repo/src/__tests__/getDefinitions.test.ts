jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()
const setMox = jest.setMock.bind(jest)

const defsMock = {}
const loadDefinitionsMock = jest.fn(() => (defsMock))
setMox('@gobletqa/shared/libs/definitions/definitions', {
  loadDefinitions: loadDefinitionsMock
})

const mockRepo:any = {
  refreshWorld: jest.fn(),
  paths: {
    stepsDir: ``,
  },
  parkin: {
    steps: {
      clear: jest.fn()
    }
  }
}
const mockConfig = {} 

const { getDefinitions } = require('../getDefinitions')

describe('getDefinitions', () => {

  it('should call loadDefinitions with the provided repo, config, and cache parameters', async () => {
    const cache = true

    const result = await getDefinitions(mockRepo, cache)

    expect(result).toEqual({ definitions: defsMock })
    expect(loadDefinitionsMock).toHaveBeenCalledWith(mockRepo, cache)
  })

  it('should call loadDefinitions with the default cache value if not provided', async () => {
    const result = await getDefinitions(mockRepo)

    expect(result).toEqual({ definitions: defsMock })
    expect(loadDefinitionsMock).toHaveBeenCalledWith(mockRepo, true)
  })
})


export {}