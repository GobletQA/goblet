import { ESectionType } from './section.types'

export type TDndItemData = {
  index:number,
  item?: string,
  gran?: string,
  parent: string,
  granType?: ESectionType,
  parentType: ESectionType,
}