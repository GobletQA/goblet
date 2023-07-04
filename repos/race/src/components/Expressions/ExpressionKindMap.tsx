import { ComponentType } from 'react'

import { ExpInput } from './ExpInput'
import { ExpSelect } from './ExpSelect'
import { ExpressionTypes, ExpressionKinds } from '@GBR/constants'

type TKindKeys = keyof typeof ExpressionKinds
  | keyof typeof ExpressionTypes

export const ExpressionKindMap:Record<TKindKeys, ComponentType<any>> = {
  [ExpressionKinds.options]: ExpSelect,
  
  [ExpressionKinds.url]: ExpInput,
  [ExpressionKinds.text]: ExpInput,
  [ExpressionKinds.number]: ExpInput,
  [ExpressionKinds.alias]: ExpInput,
  [ExpressionKinds.pairs]: ExpInput,
  [ExpressionKinds.group]: ExpInput,
  [ExpressionKinds.element]: ExpInput,
  [ExpressionKinds.selector]: ExpInput,

  [ExpressionTypes.any]: ExpInput,
  [ExpressionTypes.int]: ExpInput,
  [ExpressionTypes.word]: ExpInput,
  [ExpressionTypes.float]: ExpInput,
  [ExpressionTypes.string]: ExpInput,
  [ExpressionTypes.array]: ExpInput,
  [ExpressionTypes.object]: ExpInput,

}