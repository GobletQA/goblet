import {TRepoApiObj} from '@types'
import {getRepoData} from '@utils/store/getStoreData'

export const repoApiObj = (data?:TRepoApiObj) => {
  if(data) return data

  const { branch, remote, local } = getRepoData()?.git

  return { branch, remote, local, path: local }
}