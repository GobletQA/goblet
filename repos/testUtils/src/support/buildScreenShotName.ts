
/**
 * Builds the same of for a screen shot by cleaning up the passed in text and adding the extension param
 * @param {string} text - Text to be cleaned and used as the name
 * @param {string} ext - Extension to use for saving the screenshot
 *
 */
export const buildScreenShotName = (
  text:string,
  ext:string=`png`
) => {
  const timeStamp = new Date().getTime()
  const cleaned = text
    .replace(/[!@#$%^&*()_\\=+?:;"'<>,.{}|\/\[\]]/g, ` `)
    .trim()
    .replace(/\s/g, `-`)
    .toLowerCase()

  return `${cleaned}-${timeStamp}.${ext}`
}
