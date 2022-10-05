import type { TReposState } from '@reducers'
import type { TFConfig, TFCRow } from '@components/Form'


import { useEffect, useState, useCallback } from 'react'
import { useRepos, } from '@store'
import { exists } from '@keg-hub/jsutils'
import { getRepos } from '@actions/repo/api/getRepos'
import { EItemParent, useBuildInput, useBuildInputs } from '@components/Form'


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
    ...built
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

  return { getRepo, built }
}

type BranchSelect = {
  repo: number
  built:Record<any, any>
  repos:Record<any, any>
  isConnecting:boolean
}

const useBranchSelect = ({
  repo,
  built,
  repos,
  isConnecting,
}:BranchSelect) => {
  const buildBranches = useCallback(() => repos[repo]?.branches, [repos, repo])

  return useBuildInput({
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
}

const useNewBranch = () => {
  
}

const useBranchName = () => {
  
}

const config = {}
const row = {
  type: EItemParent.row,
  items: [
    {
      type: `input`,
      width: `full`,
      required: true,
      label: `Repo URL`,
      key: `repo-url-select`,
      placeholder: `Select a repo to connect`,
    },
    {
      type: `input`,
      width: `full`,
      required: true,
      label: `Branch`,
      key: `branch-name-select`,
      placeholder: `Select the branch`,
    }
  ]
} as TFCRow

const opts = { config, parent: 'rows' }
const useBuildForm = () => {
  const resp = useBuildInputs(row, opts)
  console.log(`------- resp -------`)
  console.log(resp)
  
  return resp
  

}


export const useConnectForm = () => {
  return useBuildForm()
  
  // const repos = useRepos()

  // const [loading, setLoading] = useState(true)
  // const [isConnecting, setIsConnecting] = useState(false)
  // const [connectError, setConnectError] = useState(false)

  // const onError = useCallback((error:any) => {
  //   setIsConnecting(false)
  //   error && setConnectError(error.message)
  // }, [])

  // const { getRepo, built } = useRepoSelect(repos)
  // const repo = getRepo()
  // const resp = useBranchSelect({
  //   repo,
  //   repos,
  //   built,
  //   isConnecting
  // })

  // // On initial load of the component, load the users repos
  // useEffect(() => {
  //   if(!loading) return
  //   if(!repos || !repos.length) getRepos()
  //   else setLoading(false)
  // }, [repos])

  // return {
  //   ...resp,
  //   loading,
  //   setLoading,
  //   onError,
  //   connectError,
  //   isConnecting,
  //   setIsConnecting,
  // }

}
