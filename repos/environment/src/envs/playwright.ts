import type { TGenEnv } from '../types'

import {asBool} from "../utils/asBool"
import {exists} from '@keg-hub/jsutils/exists'


const playwright = (general:TGenEnv) => {

  const {
    DEBUG,
    PWDEBUG,
    DEBUG_FILE,
    PW_DEBUG_FILE,
    GB_PW_SOCKET_ACTIVE,
    PW_CODEGEN_NO_INSPECTOR,
  } = process.env

  if(!exists(DEBUG_FILE) && exists(PW_DEBUG_FILE))
    process.env.DEBUG_FILE = PW_DEBUG_FILE

  return {
    DEBUG,
    PWDEBUG,
    PW_DEBUG_FILE,
    PW_CODEGEN_NO_INSPECTOR,
    DEBUG_FILE: DEBUG_FILE ?? PW_DEBUG_FILE,
    GB_PW_SOCKET_ACTIVE: asBool(GB_PW_SOCKET_ACTIVE),
  }
}

export default playwright
