jest.resetAllMocks()
jest.resetModules()
    
import { getFileTypes } from '@gobletqa/goblet'
import { getClientWorld } from '../getClientWorld'
import { Repo } from '../repo'

jest.mock('@gobletqa/workflows')

jest.mock('@ltipton/parkin', () => {
  return { Parkin: function(){}}
})


jest.mock('../getClientWorld', () => {
  return {
    getClientWorld: jest.fn(() => {
      return {
        app: {},
        $merge: {},
        $alias: {},
      }
    }),
    resetCachedWorld: jest.fn(() => {})
  }
})

const mockConfig = {
  name: ``,
  world: {},
  fileTypes: {},
  paths: {
    repoRoot: ``,
  },
  git: {
    name: `test-repo`,
    repoId: `test-repo`,
    branch: `test-branch`,
    local: `/goblet/repos/user/`,
    remote: `http://git.com/org/test-repo`,
    provider: `github.com` as const,
    username: `test-user`,
    repoName: `test-repo`,
  },
}

jest.mock('@gobletqa/goblet')
jest.mock('@gobletqa/workflows')

describe('Repo', () => {
  let mockWorld: any
  let mockRepo: any
  let mockUrl: any

  beforeEach(() => {

  })

  it('should create a Repo instance', () => {
    const repo = new Repo(mockConfig as any)

    expect(repo.git).toEqual(mockConfig.git)
    expect(repo.name).toEqual(mockConfig.name)
    expect(repo.paths).toEqual({ ...mockConfig.paths, repoRoot: mockConfig.git.local })
    expect(getClientWorld).toHaveBeenCalledWith(repo)
    expect(getFileTypes).toHaveBeenCalledWith(
      mockConfig.git.local,
      { ...mockConfig.paths, repoRoot: mockConfig.paths.repoRoot || mockConfig.git?.local }
    )
  })

  it('should set the environment', () => {
    const orgEnv = process.env.GOBLET_ENV
    const repo = new Repo(mockConfig as any)
    const environment = 'test-repo'

    repo.setEnvironment(environment)

    expect(repo.environment).toEqual(environment)
    expect(process.env.GOBLET_ENV).toEqual(environment)

    if(orgEnv){
      repo.setEnvironment(orgEnv)
      expect(repo.environment).toEqual(orgEnv)
      expect(process.env.GOBLET_ENV).toEqual(orgEnv)
    }

  })

  it('should refresh the world object', async () => {
    const repo = new Repo(mockConfig as any)
    const opts = { environment: 'test-repo' }

    mockWorld = { /* updated mock world object */ }
    // @ts-ignore
    getClientWorld.mockReturnValue(mockWorld)

    const result = repo.refreshWorld(opts)

    expect(repo.environment).toEqual(opts.environment)
    expect(getClientWorld).toHaveBeenCalledWith(repo)
    expect(result).toEqual(mockWorld)
  })

})
