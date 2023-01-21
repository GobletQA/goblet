import { TBuiltRepo } from '@types'

import { useInline } from '@hooks/useInline'
import { connectRepo } from '@actions/repo/api/connect'
import { toggleModal } from '@actions/modals/toggleModal'

export type TConnectParams = {
  branch:string,
  repo:TBuiltRepo,
  newBranch:string,
  branchFrom:boolean
}

type TConnectCB = (props:TConnectParams) => Promise<void>

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

  return useInline<TConnectCB>(async ({repo, ...params}) => {
    if(loading) return

    // setLoading?.(true)

    const resp = await connectRepo({
      ...params,
      repoUrl: repo.key
    })

    // setLoading?.(false)
    // onConnect?.(resp)

    // if (!resp)
    //   return setFormError?.(`Failed to mount repo. Please try again later.`)

    // toggleModal(false)

  })
}
