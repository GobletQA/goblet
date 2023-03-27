import { ESectionType } from './section.types'

export type TStepDndData = {
  index:number,
  step: string,
  parent: string,
  gran?: string,
  granType?: ESectionType,
  parentType: ESectionType,
}