import type { TGenEnv } from "@GENV/types"

export const exam = (general:TGenEnv) => {
  const {

    GOBLET_TEST_COLORS=general.FORCE_COLOR,

  } = process.env
  
  return {
    GOBLET_TEST_COLORS,
  }
}
