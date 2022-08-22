export const CONDUCTOR_LABEL = `com.gobletqa`
export const CONDUCTOR_USER_HASH_LABEL = `${CONDUCTOR_LABEL}.conductor`
export const FORWARD_HOST_HEADER = `x-forwarded-host`
export const FORWARD_PORT_HEADER = `x-forwarded-port`
export const FORWARD_PROTO_HEADER = `x-forwarded-proto`
export const FORWARD_SUBDOMAIN_HEADER = `x-forwarded-subdomain`


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
