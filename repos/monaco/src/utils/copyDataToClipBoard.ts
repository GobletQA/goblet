export const copyDataToClipBoard = (data: string, callback?: (res: boolean) => void) => {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.setAttribute('value', data)
  input.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    callback && callback(true)
  }
  else {
    callback && callback(false)
  }
  document.body.removeChild(input)
}