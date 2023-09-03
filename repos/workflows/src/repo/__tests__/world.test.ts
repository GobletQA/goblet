
jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()
const setMox = jest.setMock.bind(jest)
const dmMock = jest.fn((obj1, obj2) => ({ ...obj1, ...obj2 }))
setMox('@keg-hub/jsutils/deepMerge', {
  deepMerge: dmMock,
})

const getCWorldMock = jest.fn(() => ({ clientData: 'mockedClientData' }))
setMox('../getClientWorld', {
  getClientWorld: getCWorldMock
})

const { getWorld } = require('../world')

describe('getWorld', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should merge default world with client world', () => {
    const repo = { /* mock goblet config */ }
    const expectedDefaultWorld = {
      app: {
        url: process.env.GOBLET_APP_URL,
      },
    }
    const expectedClientWorld = { clientData: 'mockedClientData' }
    const expectedMergedWorld = { ...expectedDefaultWorld, ...expectedClientWorld }

    // @ts-ignore
    const result = getWorld(repo)

    expect(dmMock).toHaveBeenCalledWith(expectedDefaultWorld, expectedClientWorld)
    expect(getCWorldMock).toHaveBeenCalledWith(repo)
    expect(result).toEqual(expectedMergedWorld)
  })
})

export {}