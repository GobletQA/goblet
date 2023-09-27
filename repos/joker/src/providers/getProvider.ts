import type { TProviderOpts } from '@GJK/types'

import { OpenAI } from './openAI'
import { Logger } from '@GJK/utils/logger'
import { IntelliNode } from './intelliNode'
import { LeptonAI } from './leptonProvider'
import { EmptyProvider } from './emptyProvider'

import { EAIProvider } from '@GJK/types'

const providers = {
  [EAIProvider.OpenAI]: OpenAI,
  [EAIProvider.LeptonAI]: LeptonAI,
  [EAIProvider.IntelliNode]: IntelliNode
}

export const getProvider = (opts:TProviderOpts) => {
  try {
    const Provider = providers[opts.name]
    return new Provider(opts)
  }
  catch(err){
    Logger.empty()
    Logger.error(`Failed to initialize AI provider`)
    Logger.log(err.message)
    Logger.empty()

    return new EmptyProvider(opts)
  }
}