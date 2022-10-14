import type {
  TFCRow,
  TFCItem,
  TFCSection,
} from '../form.types'

import { EItemParent } from '../form.types'

export const isSection = (obj:any):obj is TFCSection => {
  return Boolean(`SectionNode` in obj) || Boolean(`type` in obj && obj.type === EItemParent.section)
}

export const isRow = (obj:any):obj is TFCRow => {
  return Boolean(`RowNode` in obj) || Boolean(`type` in obj && obj.type === EItemParent.row)
}

export const isItemArr = (obj:any):obj is TFCItem[] => {
  return !isRow(obj) && !isSection(obj)
}
