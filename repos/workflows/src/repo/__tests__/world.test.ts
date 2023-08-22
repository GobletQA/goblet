import { deepMerge } from '@keg-hub/jsutils'
import { getClientWorld } from '../getClientWorld'
import { getWorld } from '../world'

jest.mock('@keg-hub/jsutils', () => ({
  deepMerge: jest.fn((obj1, obj2) => ({ ...obj1, ...obj2 })),
}))

jest.mock('./getClientWorld', () => ({
  getClientWorld: jest.fn(() => ({ clientData: 'mockedClientData' })),
}))

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

    expect(deepMerge).toHaveBeenCalledWith(expectedDefaultWorld, expectedClientWorld)
    expect(getClientWorld).toHaveBeenCalledWith(repo)
    expect(result).toEqual(expectedMergedWorld)
  })
})
