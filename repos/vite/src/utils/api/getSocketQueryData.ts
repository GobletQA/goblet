import type { TContainerState } from '@types'

import { emptyObj } from '@keg-hub/jsutils'
import { getContainerData } from '@utils/store/getStoreData'


export const getSocketQueryData = (type:`screencast`|`api`, container?:TContainerState) => {
  const contData = container || getContainerData()
  return contData?.[type]?.headers || emptyObj
}