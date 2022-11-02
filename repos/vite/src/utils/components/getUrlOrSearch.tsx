import { GoogleSearchUrl } from '@constants'

export const getUrlOrSearch = async (input: string): Promise<string> => {
  const hasHttpSchema = input.startsWith("http://") || input.startsWith("https://")
  const hasTld = input.endsWith(".com")
    || input.endsWith(".ca")
    || input.endsWith(".net")
    || input.endsWith(".org")

  try {
    const { href } = new URL((hasHttpSchema || !hasTld) ? input : `https://${input}`)
    return href
  }
  catch {
    return `${GoogleSearchUrl}${input}`
  }
}