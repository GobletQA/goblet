import type { TReposState } from '@reducers'
import type { TFConfig, TFCRow } from '@components/FormGen'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRepos, } from '@store'
import { exists } from '@keg-hub/jsutils'
import { getRepos } from '@actions/repo/api/getRepos'
import { EItemParent, useBuildInput, useBuildInputs } from '@components/FormGen'


const ConnectForm:TFConfig = {
  name: `Feature Builder`,
  rows: [
    {
      id: `select-repo`,
      items: []
    },
    {
      id: `select-branch`,
      items: []
    }
  ]
}

type BranchSelect = {
  repo: number
  built:Record<any, any>
  repos:Record<any, any>
  isConnecting:boolean
}

const useBuildRepos = (repos:TReposState) => {
  return useCallback(() => {
    return !repos || !repos.length
      ? []
      : repos.map((repo, idx) => ({
          value: idx,
          key: repo.url || repo.name,
          label: repo.url || repo.name,
        }))
  }, [repos])
}

const useRepoSelect = (repos:TReposState) => {
  const buildRepos = useBuildRepos(repos)
  const {
    getValue:getRepo,
    ...repoConf
  } = useBuildInput({
    path: `rows.0.items.0`,
    type: `select`,
    width: `full`,
    required: true,
    label: `Repo URL`,
    key: `repo-url-select`,
    buildOptions: buildRepos,
    placeholder: `Select a repo to connect`,
  }, { config: ConnectForm })

  return { getRepo, repoConf }
}

const useBranchSelect = ({
  repo,
  built,
  repos,
  isConnecting,
}:BranchSelect) => {
  const buildBranches = useCallback(() => repos[repo]?.branches, [repos, repo])

  const {
    getValue:getBranch,
    ...config
  } = useBuildInput({
    path: `rows.1.items.0`,
    type: `select`,
    width: `full`,
    required: true,
    label: `Branch`,
    key: `branch-name-select`,
    buildOptions: buildBranches,
    placeholder: `Select the branch`,
    disabled: !exists(repo) || isConnecting,
  }, built)
  
  return { getBranch, branchConf:config }
}

export const useConnectForm = () => {
  const repos = useRepos()

  const [loading, setLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectError, setConnectError] = useState(false)

  const onError = useCallback((error:any) => {
    setIsConnecting(false)
    error && setConnectError(error.message)
  }, [])

  const { getRepo, repoConf } = useRepoSelect(repos)
  const repo = getRepo()

  const {
    getBranch,
    branchConf
  } = useBranchSelect({
    repo,
    repos,
    isConnecting,
    built: repoConf,
  })

  const branch = getBranch()

  // On initial load of the component, load the users repos
  useEffect(() => {
    if(!loading) return
    if(!repos || !repos.length) getRepos()
    else setLoading(false)
  }, [repos])

  return {
    ...branchConf,
    repo,
    branch,
    loading,
    setLoading,
    onError,
    connectError,
    isConnecting,
    setIsConnecting,
  }

}
