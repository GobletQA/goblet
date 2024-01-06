import { getClientWorld } from '../getClientWorld'
import { Parkin } from '@ltipton/parkin'
import { getFileTypes } from '@gobletqa/goblet'
import {
  workflows,
  createGoblet,
  statusGoblet,
  GitlabGraphApi,
  GithubGraphApi,
  initializeGoblet,
  disconnectGoblet,
} from '@gobletqa/workflows'
import { Repo } from '../repo'
const setMox = jest.setMock.bind(jest)

const ParkinMock = jest.fn(() => {
  return {}
})
setMox('@ltipton/parkin', {
  Parkin: ParkinMock
})

const getClientWorldMock = jest.fn(() => {
  return {
    app: {},
    $merge: {},
    $alias: {},
  }
})
setMox('../getClientWorld', {getClientWorld: getClientWorldMock,})

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
    remote: `git.com/org/test-repo`,
    provider: `github.com` as const,
    username: `test-user`,
    repoName: `test-repo`,
  },
}

jest.mock('../world')
jest.mock('@gobletqa/goblet')
jest.mock('@gobletqa/workflows')

describe('Repo', () => {
  let mockWorld: any
  let mockParkin: any
  let mockFileTypes: any
  let mockRepoData: any
  let mockStatus: any
  let mockRepo: any
  let mockOpts: any
  let mockUrl: any

  beforeEach(() => {
    // mockConfig = { /* mock repo configuration object */ }
    // mockWorld = { /* mock world object */ }
    // mockParkin = { /* mock parkin instance */ }
    // mockFileTypes = { /* mock file types object */ }
    // mockRepoData = { /* mock repo data object */ }
    // mockStatus = { /* mock goblet status object */ }
    // mockRepo = { /* mock repo instance */ }
    // mockOpts = { /* mock options object */ }
    // mockUrl = { /* mock URL object */ }
    // // @ts-ignore
    // Parkin.mockImplementation(() => mockParkin)
    // // @ts-ignore
    // getClientWorld.mockReturnValue(mockWorld)
    // // @ts-ignore
    // getFileTypes.mockReturnValue(mockFileTypes)
    // // @ts-ignore
    // createGoblet.mockResolvedValue({ repo: mockRepo, status: mockStatus })
    // // @ts-ignore
    // statusGoblet.mockResolvedValue({ repo: mockRepo, status: mockStatus })
    // // @ts-ignore
    // initializeGoblet.mockResolvedValue({ repo: mockRepo, status: mockStatus })
    // // @ts-ignore
    // disconnectGoblet.mockResolvedValue(undefined)
    // jest.resetAllMocks()
    // jest.resetModules()
  })

  it('should create a Repo instance', () => {
    const repo = new Repo(mockConfig as any)

    expect(repo.git).toEqual(mockConfig.git)
    expect(repo.name).toEqual(mockConfig.name)
    expect(repo.paths).toEqual({ ...mockConfig.paths, repoRoot: mockConfig.git.local })
    expect(getClientWorld).toHaveBeenCalledWith(repo)
    expect(Parkin).toHaveBeenCalledWith(mockWorld)
    expect(getFileTypes).toHaveBeenCalledWith(mockConfig.paths.repoRoot, mockConfig.paths)
  })

  it('should set the environment', () => {
    const repo = new Repo()
    const environment = 'test'

    repo.setEnvironment(environment)

    expect(repo.environment).toEqual(environment)
    expect(process.env.GOBLET_ENV).toEqual(environment)
  })

  it('should refresh the world object', async () => {
    const repo = new Repo()
    const opts = { environment: 'test' }

    mockWorld = { /* updated mock world object */ }
    // @ts-ignore
    getClientWorld.mockReturnValue(mockWorld)

    const result = repo.refreshWorld(opts)

    expect(repo.setEnvironment).toHaveBeenCalledWith(opts.environment)
    expect(getClientWorld).toHaveBeenCalledWith(repo)
    expect(mockParkin.world).toEqual(mockWorld)
    expect(result).toEqual(mockWorld)
  })

  it('should call the static getUserRepos method and return the result', async () => {
    const provider = 'Gitlab'
    const userRepos = [{ /* mock user repos data */ }]
    const expectedRepos = [{ /* filtered repos data */ }]
    const mockGitlabGraphApi = jest.fn(() => ({
      userRepos: jest.fn().mockResolvedValue(userRepos),
    }))
    const mockGithubGraphApi = jest.fn(() => ({
      userRepos: jest.fn().mockResolvedValue(userRepos),
    }))

    // @ts-ignore
    GitlabGraphApi.mockImplementation(mockGitlabGraphApi)
    // @ts-ignore
    GithubGraphApi.mockImplementation(mockGithubGraphApi)

    // @ts-ignore
    const result = await workflows.getUserRepos({ provider })

    expect(mockGitlabGraphApi).toHaveBeenCalled()
    expect(mockGithubGraphApi).not.toHaveBeenCalled()
    expect(result).toEqual(expectedRepos)
  })

  it('should call the static status method and return the result', async () => {
    const config = { /* mock goblet config */ }
    const repoData = { /* mock git options */ }
    const expectedStatus = { /* mock goblet status */ }

    // @ts-ignore
    const result = await workflows.status(config, repoData)

    expect(statusGoblet).toHaveBeenCalledWith(config, repoData, false)
    expect(result).toEqual({ status: expectedStatus, repo: mockRepo })
  })

  it('should call the static disconnect method and return the result', async () => {
    const username = 'testuser'
    const expectedDisconnectResult = undefined
    const result = await workflows.disconnect({ username })

    // @ts-ignore
    expect(resetGobletConfig).toHaveBeenCalled()
    expect(disconnectGoblet).toHaveBeenCalledWith({ user: { gitUser: username } })
    expect(result).toEqual(expectedDisconnectResult)
  })

  it('should call the static create method and return the result', async () => {
    const args = { /* mock create arguments */ }
    const name = 'testrepo'
    const token = 'testtoken'
    const branch = 'main'
    const provider = 'Github'
    const username = 'testuser'
    const newBranch = 'feature-branch'
    const branchFrom = 'main'
    const description = 'Test repo'
    const organization = 'testorg'
    const expectedCreateResult = { /* mock create result */ }
    const result = await workflows.create({
      name,
      token,
      branch,
      provider,
      username,
      newBranch,
      // @ts-ignore
      branchFrom,
      description,
      organization,
    })

    expect(createGoblet).toHaveBeenCalledWith({
      token,
      user: { gitUser: username },
      create: {
        name,
        branch,
        provider,
        newBranch,
        branchFrom,
        description,
        organization,
      },
    })
    expect(result).toEqual(expectedCreateResult)
  })

  it('should call the static fromWorkflow method and return the result', async () => {
    const args = { /* mock fromWorkflow arguments */ }
    const token = 'testtoken'
    const branch = 'main'
    const repoUrl = 'https://github.com/testuser/testrepo.git'
    const username = 'testuser'
    const newBranch = 'feature-branch'
    const branchFrom = 'main'
    const expectedFromWorkflowResult = { /* mock fromWorkflow result */ }

    mockUrl = { host: 'github.com', pathname: '/testuser/testrepo.git' }
    // @ts-ignore
    URL.mockImplementation(() => mockUrl)
    const result = await workflows.fromWorkflow({
      token,
      branch,
      repoUrl,
      username,
      newBranch,
      // @ts-ignore
      branchFrom,
    })

    expect(URL).toHaveBeenCalledWith(repoUrl)
    expect(initializeGoblet).toHaveBeenCalledWith({
      token,
      user: { gitUser: username },
      repo: {
        name: 'testrepo',
        branch,
        repoId: 'testuser/testrepo',
        provider: 'github.com',
        newBranch,
        branchFrom,
        url: repoUrl,
      },
    })
    expect(result).toEqual(expectedFromWorkflowResult)
  })
})
