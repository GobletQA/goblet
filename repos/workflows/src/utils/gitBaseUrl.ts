import { EProvider } from '@gobletqa/workflows/types'

/**
 * Removes the `.git` extension from the url if it exists
 */
export const gitBaseUrl = (url:string) => {
  const cleaned = url.replace(/\.git$/, ``)
  if(!cleaned.includes(EProvider.Gitlab)) return cleaned

  const urlObj = new URL(cleaned)
  urlObj.pathname = encodeURIComponent(urlObj.pathname.replace(/^\//, ``)) 

  return urlObj.toString()
}