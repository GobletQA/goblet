import { EItemParent } from '../form.types'

export const parentKeyMap = {
  [EItemParent.row]: EItemParent.rows,
  [EItemParent.rows]: EItemParent.rows,
  [EItemParent.section]: EItemParent.sections,
  [EItemParent.sections]: EItemParent.sections,
}

export const pathItems = [
  `items`,
  EItemParent.row,
  EItemParent.rows,
  EItemParent.section,
  EItemParent.sections,
]