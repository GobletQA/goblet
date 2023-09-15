import type { TGenEnv } from '../types'

const joker = (general:TGenEnv) => {

  const {
    GB_OPEN_AI_KEY,
    GB_OPEN_AI_ORG_ID,

    GB_LEPTON_AI_TOKEN,
    GB_LEPTON_AI_CODE_URL,
    GB_LEPTON_AI_CHAT_URL,

    GB_AI_PROVIDER=`LeptonAI`,

    GB_JK_AI_URL,
    GB_JK_AI_KEY,
    GB_JK_AI_ORG_ID,

  } = process.env

  return {
    GB_OPEN_AI_KEY,
    GB_OPEN_AI_ORG_ID,

    GB_LEPTON_AI_TOKEN,
    GB_LEPTON_AI_CODE_URL,
    GB_LEPTON_AI_CHAT_URL,

    GB_AI_PROVIDER,

    GB_JK_AI_URL,
    GB_JK_AI_KEY,
    GB_JK_AI_ORG_ID,
  }
}

export default joker
