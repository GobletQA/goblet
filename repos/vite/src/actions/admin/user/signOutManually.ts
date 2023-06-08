import {containerApi} from '@services/containerApi'
import { getContainerData } from '@utils/store/getStoreData'
import { signOutAuthUser } from '../provider/signOutAuthUser'

export type TSignOutManually = {
  id?:string
}

export const signOutManually = async (params?:TSignOutManually) => {
  try {
    const containerId = params?.id || getContainerData()?.meta?.id
    await containerApi.remove({ id: containerId })
  }
  catch(err){
    console.log(`Error removing session container`)
    console.log(err)
  }

  await signOutAuthUser()
}