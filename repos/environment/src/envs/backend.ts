import type { TGenEnv } from "@GENV/types"
import {toBool} from "@keg-hub/jsutils"

const {
  GB_BE_PORT,
  GB_BE_HOST,
  GB_BE_WS_PATH,
  GB_BE_WS_PROTOCOL,
  GB_BE_SECURE_PORT,

  GB_SERVER_ORIGINS,

  GB_NO_VNC_PATH,
  GB_NO_VNC_PROTOCOL,

  GB_KD_WS_PROXY_PORT,
  GB_KD_VNC_PROXY_PORT,

  GB_DD_WS_PROXY_PORT,
  GB_DD_VNC_PROXY_PORT,

  GB_CD_VALIDATION_KEY,
  GB_CD_CONTROLLER_TYPE,
  GB_CD_VALIDATION_HEADER,

  GB_BE_JWT_EXP,
  GB_BE_JWT_SECRET,
  GB_BE_JWT_ALGO=`HS256`,
  GB_BE_JWT_CREDENTIALS,
  GB_BE_JWT_REFRESH_EXP,
  GB_BE_JWT_REFRESH_SECRET,
} = process.env


const backend = (general:TGenEnv) => {

  return {
    GB_BE_PORT,
    GB_BE_HOST,
    GB_BE_WS_PATH,
    GB_BE_WS_PROTOCOL,
    GB_BE_SECURE_PORT,

    GB_SERVER_ORIGINS,

    GB_KD_WS_PROXY_PORT,
    GB_KD_VNC_PROXY_PORT,

    GB_NO_VNC_PATH,
    GB_NO_VNC_PROTOCOL,

    GB_DD_WS_PROXY_PORT,
    GB_DD_VNC_PROXY_PORT,

    GB_CD_VALIDATION_KEY,
    GB_CD_CONTROLLER_TYPE,
    GB_CD_VALIDATION_HEADER,

    GB_BE_JWT_EXP,
    GB_BE_JWT_ALGO,
    GB_BE_JWT_SECRET,
    GB_BE_JWT_REFRESH_EXP,
    GB_BE_JWT_REFRESH_SECRET,
    GB_BE_JWT_CREDENTIALS: toBool(GB_BE_JWT_CREDENTIALS || true),
  }
}

export default backend
