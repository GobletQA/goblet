
jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()
const setMox = jest.setMock.bind(jest)

const worldMock = {
  app: { url: `world-mock.com` },
  data: { some: `data` },
  $merge: [],
  $alias: {},
  $context: {},
}

const repoWorldLoaderMock = jest.fn(() => (worldMock))
const getGobletConfigMock = jest.fn()
const getRepoGobletDirMock = jest.fn(() => `/test-repo`)

setMox('@gobletqa/goblet', {
  getGobletConfig: getGobletConfigMock,
  repoWorldLoader: repoWorldLoaderMock,
  getRepoGobletDir: getRepoGobletDirMock,
})

const DefWorld = {
  app: {},
  data: {},
  $merge: [],
  $alias: {},
  $context: {},
}


process.env.GOBLET_ENV = `test-env`
process.env.GOBLET_CONFIG_BASE = `/test/base/repo`
process.env.GB_GIT_REPO_REMOTE = `test-repo-remote`
process.env.GB_REPO_CONFIG_REF = `some-test-ref`
let orgGobletEnv:string
let orgGobletBase:string

const {
  getClientWorld,
  loadClientWorld,
  setGobletEnv,
} = require('../getClientWorld')


describe('setGobletEnv', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    orgGobletEnv = `test-env`
    orgGobletBase = `/test/base/repo`
  })

  it('should overwrite GOBLET_ENV and GOBLET_CONFIG_BASE with values from the passed config', () => {
    const config = {
      environment: `changed`,
      paths: {
        repoRoot: `/path/to/repo`,
      },
    }

    const resetEnvs = setGobletEnv(config)
    expect(process.env.GOBLET_ENV).toBe(`changed`)
    expect(process.env.GOBLET_CONFIG_BASE).toBe(`/path/to/repo`)

    resetEnvs()

    expect(process.env.GOBLET_ENV).toBe(orgGobletEnv)
    expect(process.env.GOBLET_CONFIG_BASE).toBe(orgGobletBase)
  })

  it('should not modify GOBLET_ENV and GOBLET_CONFIG_BASE if config does not have environment and paths', () => {
    const resetEnvs = setGobletEnv({})

    expect(process.env.GOBLET_ENV).toBe(orgGobletEnv)
    expect(process.env.GOBLET_CONFIG_BASE).toBe(orgGobletBase)

    resetEnvs()

    expect(process.env.GOBLET_ENV).toBe(orgGobletEnv)
    expect(process.env.GOBLET_CONFIG_BASE).toBe(orgGobletBase)
  })
})

describe('loadClientWorld', () => {
  let mockConfig: any
  let worldMock: any

  beforeEach(() => {
    mockConfig = {
      paths: {
        world: '/path/to/world.json',
      },
    }
    repoWorldLoaderMock.mockClear()
    getGobletConfigMock.mockClear()
    getRepoGobletDirMock.mockClear()
  })

  it('should return the default world if worldPath is not defined', () => {
    const config = { paths: {}}

    const result = loadClientWorld(config)

    expect(result).toEqual(DefWorld)
    expect(getRepoGobletDirMock).not.toHaveBeenCalled()
  })

  it('should load and merge the world file from the specified path', () => {
    const result = loadClientWorld(mockConfig)

    expect(result).toEqual({...DefWorld, ...worldMock})
    expect(getRepoGobletDirMock).toHaveBeenCalledWith(mockConfig)
    expect(repoWorldLoaderMock).toHaveBeenCalledWith({
      basePath: getRepoGobletDirMock(),
      clearCache: true,
      file: 'world.json',
      location: '/path/to/world.json',
    })
  })

  it('should handle errors during world file loading', () => {
    const orgLog = console.log
    const orgWarn = console.warn
    console.log = jest.fn()
    console.warn = jest.fn()
    
    // @ts-ignore
    repoWorldLoaderMock.mockImplementation(() => {
      throw new Error('Failed to load world file')
    })

    const result = loadClientWorld(mockConfig)

    expect(result).toEqual({...DefWorld, ...worldMock})
    expect(getRepoGobletDirMock).toHaveBeenCalledWith(mockConfig)
    expect(repoWorldLoaderMock).toHaveBeenCalledWith({
      basePath: getRepoGobletDirMock(),
      clearCache: true,
      file: 'world.json',
      location: '/path/to/world.json',
    })

    // Expect additional error handling logic
    expect(console.log).toHaveBeenCalled()
    console.log = orgLog
    console.warn = orgWarn
  })
})

describe('getClientWorld', () => {

  beforeEach(() => {
    getGobletConfigMock.mockClear()
    getRepoGobletDirMock.mockClear()
    repoWorldLoaderMock.mockClear()
    repoWorldLoaderMock.mockImplementation(() => (worldMock))
  })

  it('should call loadClientWorld with the default goblet config', () => {
    const result = getClientWorld()
    expect(result).toEqual({...DefWorld})
  })

  it('should call loadClientWorld with the passed repo goblet config', () => {
    const customMockCfg = { custom: `value`, paths: { world: `some-loc` } }
    const result = getClientWorld(customMockCfg)
    expect(result).toEqual({...DefWorld, ...worldMock})
  })
})


export {}