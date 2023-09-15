import type { TProviderOpts } from '@GJK/types'

import { OpenAI } from './openAI'
import { IntelliNode } from './intelliNode'
import { LeptonAI } from './leptonProvider'


import { EAIProvider } from '@GJK/types'

const providers = {
  [EAIProvider.OpenAI]: OpenAI,
  [EAIProvider.LeptonAI]: LeptonAI,
  [EAIProvider.IntelliNode]: IntelliNode
}

export const getProvider = (opts:TProviderOpts) => {
  const Provider = providers[opts.name]
  return new Provider(opts)
}