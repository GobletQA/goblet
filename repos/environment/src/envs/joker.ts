import type { TGenEnv } from '../types'

const joker = (general:TGenEnv) => {

  const {
    GB_LEPTON_AI_URL,
    GB_LEPTON_AI_TOKEN,
    GB_OPEN_AI_KEY,
    GB_OPEN_AI_ORG_ID,
  } = process.env

  return {
    GB_OPEN_AI_KEY,
    GB_OPEN_AI_ORG_ID,
    GB_LEPTON_AI_URL,
    GB_LEPTON_AI_TOKEN,
  }
}

export default joker
