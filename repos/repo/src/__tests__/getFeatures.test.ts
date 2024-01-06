jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()
const setMox = jest.setMock.bind(jest)

const featuresMock = {}
const loadFeaturesMock = jest.fn(() => (featuresMock))
setMox('@gobletqa/shared/fs', {
  loadFeatures: loadFeaturesMock
})

const definitionsMock = {}
const getDefinitionsMock = jest.fn(() => ({ definitions: definitionsMock}))
setMox('@GRP/getDefinitions', {
  getDefinitions: getDefinitionsMock
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

const { getFeatures } = require('../getFeatures')

describe('getFeatures', () => {

  it('should call getDefinitions and loadFeatures with the provided repo and config', async () => {
    const result = await getFeatures(mockRepo)
    expect(result).toEqual({ features: featuresMock, definitions: definitionsMock })
    expect(getDefinitionsMock).toHaveBeenCalledWith(mockRepo, mockConfig)
    expect(loadFeaturesMock).toHaveBeenCalledWith(mockRepo)
  })
})

export {}