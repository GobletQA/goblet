import { EEditorType } from '@types'
import { emptyObj } from '@keg-hub/jsutils'
import {getAppData} from '@utils/store/getStoreData'
import { getSettings as getRaceSettings } from '@gobletqa/race'

export const getEditorSettings = async () => {
  const { editor } = getAppData()
  
  return editor === EEditorType.Visual
    ? await getRaceSettings()
    : emptyObj
}