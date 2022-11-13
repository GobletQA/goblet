
export type TClipBoardCopy = {
  key?:string
  clean?:boolean
  warn?: boolean
  content?:string
  element?:HTMLElement
  callback?: (...args:any[]) => any
}

const noContentWarn = (warn:boolean, callback?: (...args:any[]) => any) => {
  warn && console.warn(`No content was found to copy to the clipboard`)
  callback?.(false)
}

export const copyToClipBoard = async ({
  element,
  content,
  callback,
  warn=true,
  key=`innerText`,
}:TClipBoardCopy) => {
  const data = content || element[key]
  if(!data) return noContentWarn(warn, callback)

  await navigator.clipboard.writeText(data)
  callback?.(true, data)
  return true
}

export const copyText = async (content:string) => copyToClipBoard({ content })

export const Clipboard = {
  copyText,
  copy: copyToClipBoard,
}