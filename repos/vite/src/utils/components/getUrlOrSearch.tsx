import { GoogleSearchUrl } from '@constants'

export const getUrlOrSearch = (input: string): Record<string, string> => {
  let url = ``
  const winProto = window.location.protocol
  const hasHttpSchema = input.startsWith("http://") || input.startsWith("https://")
  const hasTld = input.endsWith(".com")
    || input.endsWith(".ca")
    || input.endsWith(".net")
    || input.endsWith(".org")
    || input.endsWith(".io")
    || input.endsWith(".dev")
    || input.endsWith(".local")

  try {
    const { href } = new URL(
      (hasHttpSchema || !hasTld) ? input : `${winProto}://${input}`
    )

    url = href
  }
  catch {
    url = `${GoogleSearchUrl}${input}`
  }
  finally {
    const addressUrl = new URL(url).href
    const localUrl = new URL(window.location.origin)
    localUrl.pathname = `/goblet-iframe`
    localUrl.search = `url=${encodeURI(addressUrl)}`
    return {
      addressUrl,
      iframeUrl: localUrl.toString()
    }
  }

}