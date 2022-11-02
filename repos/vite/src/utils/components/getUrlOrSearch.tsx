import { GoogleSearchUrl } from '@constants'

export const getUrlOrSearch = async (input: string): Promise<string> => {
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

    return href
  }
  catch {
    return `${GoogleSearchUrl}${input}`
  }
}