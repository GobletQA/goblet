import { Environment } from '@constants'
let __BASE_API_URL:string

/**
 * Builds the base url for all api calls using ENVs replaced at build time
 *
 * @returns {string} - Base Backend API url
 */
export const getBaseApiUrl = () => {
  if(__BASE_API_URL) return __BASE_API_URL

  // Use the windows current protocol to set the servers protocol
  // They should always match
  // Deployed environments will be https, local is http
  const { protocol } = new URL(window.location.origin)
  const isHttps = Boolean(protocol.includes(`https`))

  const bePort = !isHttps
    && Environment !== `production`
    && process.env.GB_BE_PORT

  // Use the hostname for the base on dev
  // Otherwise cookies will not be set, due to being served via http
  // If we start serving local dev via https, this this will not be needed
  let apiBaseHost = process.env.GB_BE_HOST || ``

  // If the port exists, then add it to the apiBase host
  bePort
    && bePort !== `80`
    && bePort !== `443`
    && !apiBaseHost.includes(`:`)
    && (apiBaseHost += `:${bePort}`)

  // Remove all protocols variations, to ensure it does not exist
  const noProtoHost = apiBaseHost.replace(`https://`, '')
    .replace(`http://`, '')
    .replace(`wss://`, '')
    .replace(`ws://`, '')

  __BASE_API_URL = `${protocol}//${noProtoHost}`

  return __BASE_API_URL
}

