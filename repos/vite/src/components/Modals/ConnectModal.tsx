import type { TRepo } from '@types'
import type { TFConfig, TFCItem } from '@components/Form'

import type { ComponentProps, ChangeEvent } from 'react'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { useRepos } from '@store'
import Box from '@mui/material/Box'
import { ModalTypes } from '@constants'
import { exists } from '@keg-hub/jsutils'
import { ConnectIcon } from '@components/Icons'
import { getRepos } from '@actions/repo/api/getRepos'
import { FormGen, useBuildInput } from '@components/Form'

import { ModalRoot } from '@components/ModalManager/ModalRoot'

export type TConnectModal = ComponentProps<typeof ModalRoot>


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


export const ConnectModal = (props:TConnectModal) => {
  const repos = useRepos()
  const [loading, setLoading] = useState(true)

  // On initial load of the component, load the users repos
  useEffect(() => {
    if(!loading) return
    if(!repos || !repos.length) getRepos()
    else setLoading(false)
  }, [repos])

  const buildRepos = useCallback(() => {
    return !repos || !repos.length
      ? []
      : repos.map((repo, idx) => ({
          value: idx,
          key: repo.url || repo.name,
          label: repo.url || repo.name,
        }))
  }, [repos])

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

  const repo = getRepo()
  const buildBranches = useCallback(() => repos[repo]?.branches, [repos, repo])

  const { config } = useBuildInput({
    path: `rows.1.items.0`,
    type: `select`,
    width: `full`,
    required: true,
    label: `Branch`,
    disabled: !exists(repo),
    key: `branch-name-select`,
    buildOptions: buildBranches,
    placeholder: `Select the branch`,
  }, built)

  return (
    <Box>
      <FormGen
        config={config}
        loading={loading}
      />
    </Box>
  )
}

ConnectModal.modalType = ModalTypes.connect
ConnectModal.modalProps = {
  title: `Connect Repo`,
  manualClose: false,
  titleProps: {
    Icon: (<ConnectIcon />)
  }
}