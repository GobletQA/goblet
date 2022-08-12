const { HOSTNAME } = process.env

export const SUBDOMAIN = `conductor`
export const CONDUCTOR_LABEL = `com.gobletqa`
export const DEF_HOST_IP = HOSTNAME || `localhost`
export const CONDUCTOR_SUBDOMAIN_LABEL = `${CONDUCTOR_LABEL}.conductor`

export const CONTAINER_LABELS = [
  `idle`,
  `timeout`,
  `rateLimit`
]