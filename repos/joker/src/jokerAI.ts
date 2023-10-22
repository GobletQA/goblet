import { Joker } from './joker'
import { ENVS } from '@gobletqa/environment'
import { EAIModel, EAIProvider } from './types'

const providerAuth = {
  [EAIProvider.JokerAI]: {
    baseURL: ENVS.GB_JK_AI_URL,
    apiKey: ENVS.GB_JK_AI_KEY,
    organization: ENVS.GB_JK_AI_ORG_ID
  },
  [EAIProvider.LeptonAI]: {
    apiKey: ENVS.GB_LEPTON_AI_TOKEN ?? ENVS.GB_JK_AI_KEY,
    baseURL: `https://codellama-34b.lepton.run/api/v1`,
    // baseURL: ENVS.GB_LEPTON_AI_CODE_URL ?? ENVS.GB_LEPTON_AI_CHAT_URL ?? ENVS.GB_JK_AI_URL,
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

const providerDefs = {
  [EAIProvider.JokerAI]: {
    model: ENVS.GB_JK_AI_MODEL
  },
  [EAIProvider.OpenAI]: {
    model: ENVS.GB_JK_AI_MODEL ?? ENVS.GB_OPEN_AI_MODEL ?? EAIModel.GPT3T,
  },
  [EAIProvider.LeptonAI]: {
    model: ENVS.GB_JK_AI_MODEL ?? ENVS.GB_LEPTON_AI_MODEL ?? EAIModel.CodeLlama34,
    // model: EAIModel.PCodeLlama34
  }
}


const provider = ENVS.GB_AI_PROVIDER as EAIProvider
export const jokerAI = new Joker({
  provider: {
    name: provider,
    auth: providerAuth[provider],
    defaults: providerDefs[provider],
  }
})
