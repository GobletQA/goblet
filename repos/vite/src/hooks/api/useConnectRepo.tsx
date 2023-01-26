import { TConnectRepo, TCreateRepo, TBuiltRepo } from '@types'

import { useInline } from '@hooks/useInline'
import { connectRepo } from '@actions/repo/api/connect'
import { toggleModal } from '@actions/modals/toggleModal'
import { createRepo as createNewRepo } from '@actions/repo/api/create'

export type TConnectParams = Omit<TConnectRepo, `repo`> & {
  repo:TBuiltRepo,
}

export type TCreateParams = Omit<TCreateRepo, `repo`> & {
  repo:TBuiltRepo,
}

type TConnectCB = (props:TConnectParams|TCreateParams) => Promise<void>

export type THConnectRepo = {
  loading?:boolean
  onConnect?: (...args:any[]) => void
  setFormError?:(error:string) => void
  setLoading?:(loading:boolean) => void
}

export const useConnectRepo = (props:THConnectRepo) => {
  const {
    loading,
    onConnect,
    setLoading,
    setFormError,
  } = props

  return useInline<TConnectCB>(async (params) => {
    if(loading) return

    setLoading?.(true)

    const {
      repo,
      newRepo,
      createRepo,
      description,
      ...rest
    } = params

    const resp = createRepo
      ? await createNewRepo({ ...rest, name: newRepo, description })
      : await connectRepo({ ...rest, repoUrl: repo?.id })

    setLoading?.(false)
    onConnect?.(resp)

    !resp
      ? setFormError?.(`Failed to mount repo. Please try again later.`)
      : toggleModal(false)

  })
}
