import { toBool, toNum } from '@keg-hub/jsutils'

export const Environment = process.env.NODE_ENV || `local`

// Only used in local environments
export const AuthActive = Environment === `local`
  ? toBool(process.env.GB_AUTH_ACTIVE)
  : true

export const LastOpenedFilesAmount = toNum(process.env.GB_LAST_OPENED_AMOUNT || 5)
