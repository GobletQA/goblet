import { EItemParent } from '../form.types'
import { itemsFactory } from './itemsFactory'
import { rowFactory, rowsFactory, sectionFactory, sectionsFactory } from './parentFactory'

export const factoryMap = {
  item: itemsFactory,
  items: itemsFactory,
  [EItemParent.row]: rowFactory,
  [EItemParent.rows]: rowsFactory,
  [EItemParent.section]: sectionFactory,
  [EItemParent.sections]: sectionsFactory,
}

export {
  rowFactory,
  rowsFactory,
  itemsFactory,
  sectionFactory,
  sectionsFactory,
}