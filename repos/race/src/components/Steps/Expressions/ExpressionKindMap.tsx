import { ComponentType } from 'react'

import { ExpInput } from './ExpInput'
import { ExpAutoInput } from './ExpAutoInput'
import { EExpParmKind, EExpParmType } from '@GBR/types'

export const ExpressionKindMap:Record<EExpParmKind|EExpParmType, ComponentType<any>> = {
  [EExpParmKind.url]: ExpInput,
  [EExpParmKind.text]: ExpInput,
  [EExpParmKind.number]: ExpInput,
  [EExpParmKind.element]: ExpInput,
  [EExpParmKind.alias]: ExpInput,
  [EExpParmKind.pairs]: ExpInput,
  [EExpParmKind.group]: ExpInput,
  [EExpParmKind.selector]: ExpInput,

  [EExpParmType.any]: ExpInput,
  [EExpParmType.int]: ExpInput,
  [EExpParmType.word]: ExpInput,
  [EExpParmType.float]: ExpInput,
  [EExpParmType.string]: ExpInput,
  [EExpParmType.array]: ExpInput,
  [EExpParmType.object]: ExpInput,

}