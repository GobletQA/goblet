import {containerApi} from '@services/containerApi'
import { getContainerData } from '@utils/store/getStoreData'
import { signOutAuthUser } from '../provider/signOutAuthUser'

export type TSignOutManually = {
  id?:string
}

export const signOutManually = async (params?:TSignOutManually) => {
  const containerId = params?.id || getContainerData()?.meta?.id
  await signOutAuthUser()
  await containerApi.remove({ id: containerId })
}