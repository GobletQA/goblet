const { HOSTNAME, GB_CD_HOST } = process.env

export const SUBDOMAIN = `conductor`
export const CONDUCTOR_LABEL = `com.gobletqa`
export const DEF_HOST_IP = HOSTNAME || GB_CD_HOST
export const CONDUCTOR_SUBDOMAIN_LABEL = `${CONDUCTOR_LABEL}.conductor`

export const CONTAINER_LABELS = [
  `idle`,
  `timeout`,
  `rateLimit`
]

export const AUTH_BYPASS_ROUTES = [
  `/`,
  `/health-check`,
  `/favicon.ico`,
]