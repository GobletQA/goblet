

/**
 * Auto generates a download URL from the passed in blog
 * The creates a link and clicks it to start the file download
 * Requires a Browser environment, with document and window globals
 */
export const downloadBlob = (blob:Blob, name:string=`goblet-download`) => {
  const element = document.createElement(`a`)
  element.href = window.URL.createObjectURL(new Blob([blob]))
  element.download = name
  document.body.appendChild(element)
  element.click()
  element.remove()
}
