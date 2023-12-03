import type { TGenEnv } from '../types'

const playwright = (general:TGenEnv) => {

  const {
    PW_CODEGEN_NO_INSPECTOR
  } = process.env

  return {
    PW_CODEGEN_NO_INSPECTOR
  }
}

export default playwright
