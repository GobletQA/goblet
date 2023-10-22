import type { Repo } from '@GSC/types'
import type { TLoadRepoFromSocket } from './loadRepoFromSocket'

import { loadRepoFromSocket } from './loadRepoFromSocket'

type TWithRepo = { repo:Repo }
type TRecord = Record<string, any>
type TWithRepoCB<T> = (props:TWithRepoProps<T>) => any
type TWithSocketRepo<T extends TRecord=TRecord> = (TLoadRepoFromSocket & T)
type TWithRepoProps<T extends TRecord=TRecord> = TWithSocketRepo<T> & TWithRepo


export const withRepo = <T extends TRecord=TRecord>(cb:TWithRepoCB<T>) => async (props:TWithSocketRepo<T>) => {
  const loaded = await loadRepoFromSocket({
    user: props?.user,
    repo: props?.data?.repo || props?.repo,
  })

  return await cb({...props, ...loaded})
}
