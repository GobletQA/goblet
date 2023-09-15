import { EAIProvider } from './types'
import { ENVS } from '@gobletqa/environment'
import { Joker } from './joker'

const providerAuth = {
  [EAIProvider.JokerAI]: {
    baseURL: ENVS.GB_JK_AI_URL,
    apiKey: ENVS.GB_JK_AI_KEY,
    organization: ENVS.GB_JK_AI_ORG_ID
  },
  [EAIProvider.LeptonAI]: {
    apiKey: ENVS.GB_LEPTON_AI_TOKEN ?? ENVS.GB_JK_AI_KEY,
    baseURL: ENVS.GB_LEPTON_AI_CODE_URL ?? ENVS.GB_LEPTON_AI_CHAT_URL ?? ENVS.GB_JK_AI_URL,
  },
  [EAIProvider.OpenAI]: {
    apiKey: ENVS.GB_OPEN_AI_KEY ?? ENVS.GB_JK_AI_KEY,
    organization: ENVS.GB_OPEN_AI_ORG_ID ?? ENVS.GB_JK_AI_ORG_ID 
  },
  [EAIProvider.IntelliNode]: {
    organization: ENVS.GB_JK_AI_ORG_ID ?? ENVS.GB_OPEN_AI_ORG_ID,
    apiKey: ENVS.GB_JK_AI_KEY ?? ENVS.GB_OPEN_AI_KEY ?? ENVS.GB_LEPTON_AI_TOKEN,
    baseURL: ENVS.GB_JK_AI_URL ?? ENVS.GB_LEPTON_AI_CODE_URL ?? ENVS.GB_LEPTON_AI_CHAT_URL,
  }
}

export const jokerAI = new Joker({
  provider: {
    name: ENVS.GB_AI_PROVIDER as EAIProvider,
    auth: providerAuth[ENVS.GB_AI_PROVIDER as EAIProvider],
  }
})