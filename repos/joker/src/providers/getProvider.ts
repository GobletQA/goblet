import type { TProviderOpts } from '@GJK/types'

import { OpenAI } from './openAI'
import { IntelliNode } from './intelliNode'

import { EAIProvider } from '@GJK/types'

const providers = {
  [EAIProvider.OpenAI]: OpenAI,
  [EAIProvider.IntelliNode]: IntelliNode
}

export const getProvider = (opts:TProviderOpts) => {
  const Provider = providers[opts.name]
  return new Provider(opts)
}