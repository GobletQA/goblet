
export const NOT_REPLACE = '( not)*'
export const NOT_INDEX = `NOT_INDEX`
export const PARAMETER = `PARAMETER`
export const NOT_PARAMETER = `NOT_PARAMETER`
export const AUTH_BYPASS_ROUTES = [
  `/`,
  `/auth/validate`,
  `/health-check`,
  `/favicon.ico`,
  `/goblet-socket`,
  `/goblet-socket/`,
  `/iframe`,
  `/repo/disconnect`,
  // For DEV Only -- remember to remove this
  // /\/container\/.*/,
]
