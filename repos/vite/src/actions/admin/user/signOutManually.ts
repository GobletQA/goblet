import {containerApi} from '@services/containerApi'
import { getContainerData } from '@utils/store/getStoreData'
import { signOutAuthUser } from '../provider/signOutAuthUser'

export type TSignOutManually = {
  id?:string
  idleSignOut?:boolean
}

export const signOutManually = async (params?:TSignOutManually) => {
  try {
    const containerId = params?.id || getContainerData()?.meta?.id
    const idleSignOut = params?.idleSignOut
    await containerApi.remove({ id: containerId, idleSignOut })
  }
  catch(err){
    console.log(`Error removing session container`)
    console.log(err)
  }

  await signOutAuthUser()
}