
export type TClipBoardCopy = {
  key?:string
  clean?:boolean
  warn?: boolean
  content?:string
  element?:HTMLElement
  callback?: (...args:any[]) => any
}


const defaultMessage = "Copy to clipboard: #{key}, Enter"

const format = (message:string) => {
  const copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C"
  return message.replace(/#{\s*key\s*}/g, copyKey)
}

const noContentWarn = (warn:boolean, callback?: (...args:any[]) => any) => {
  warn && console.warn(`No content was found to copy to the clipboard`)
  callback?.(false)
}


const tryCmd = (copyCmd:(content?:string) => void, content?:string) => {
  try {
    copyCmd(content)
    return true
  }
  catch(e){
    return false
  }
}

const cleanContent = (content:string, copyCmd?:(content:string) => any) => {
  const body = document.body

  if (body) {
    // add the text to a hidden node
    const node = document.createElement('span')
    node.textContent = content
    node.style.opacity = '0'
    node.style.position = 'absolute'
    node.style.whiteSpace = 'pre-wrap'
    node.style.userSelect = 'auto'
    body.appendChild(node)

    // Select the text
    const selection = window.getSelection()
    selection.removeAllRanges()
    const range = document.createRange()
    range.selectNodeContents(node)
    selection.addRange(range)

    if(copyCmd){
      let copied = tryCmd(() => document.execCommand('copy'))
      copied = copied || copyCmd(node.textContent)
    }

    // Remove selection and node
    selection.removeAllRanges()
    body.removeChild(node)
  }
}


export type TCCBOpts = {
  debug: boolean
  format: boolean
  message: string
  callback?: (...args:any[]) => any
}

export const copyToClipBoard = (text:string, options:TCCBOpts) => {
  let mark
  let range
  let debug
  let message
  let selection
  let success = false

  if (!options) options = {} as TCCBOpts

  debug = options.debug || false
  try {

    range = document.createRange()
    selection = document.getSelection()

    mark = document.createElement("span")
    mark.textContent = text
    mark.ariaHidden = "true"
    mark.style.all = "unset"
    mark.style.position = "fixed"
    mark.style.top = 0
    mark.style.clip = "rect(0, 0, 0, 0)"
    mark.style.whiteSpace = "pre"
    mark.style.webkitUserSelect = "text"
    mark.style.MozUserSelect = "text"
    mark.style.msUserSelect = "text"
    mark.style.userSelect = "text"

    mark.addEventListener("copy", (e:any) => {
      e.stopPropagation()
      if (options.format) {
        e.preventDefault()
        e.clipboardData.clearData()
        e.clipboardData.setData(options.format, text)
      }
      if (options.callback) {
        e.preventDefault()
        options.callback(true, e.clipboardData)
      }
    })

    document.body.appendChild(mark)

    range.selectNodeContents(mark)
    selection.addRange(range)

    let successful = document.execCommand("copy")
    if (!successful) 
      throw new Error("copy command was unsuccessful")

    success = true
  }
  catch (err) {
    debug && console.error("unable to copy using execCommand: ", err)
    try {
      ;(window as any).clipboardData.setData(options.format || "text", text)
      options.callback && options.callback(true, (window as any).clipboardData)
      success = true
    }
    catch (err) {
      message = format("message" in options ? options.message : defaultMessage)
      window.prompt(message, text)
    }
  }
  finally {
    if (selection) {
      typeof selection.removeRange == "function"
        ? selection.removeRange(range) 
        : selection.removeAllRanges()
    }
    mark && document?.body?.removeChild(mark)
  }

  return success
}

export const copyElementTextToClipBoard = async ({
  element,
  content,
  callback,
  warn=true,
  clean=true,
  key=`innerText`,
}:TClipBoardCopy) => {
  const data = content || element[key]
  if(!data) return noContentWarn(warn, callback)

  const toCopy = clean ? cleanContent(data): data

  const resp = await navigator.clipboard.writeText(toCopy)
  callback?.(true, toCopy)

  return resp
}

export const copyRichTextToClipBoard = async ({
  element,
  content,
  callback,
  warn=true,
  key=`innerHTML`,
}:TClipBoardCopy) => {
  const data = content || element[key]

  if(!data) return noContentWarn(warn, callback)

  const blob = new Blob([data], { type: `text/html` })
  const richTextInput = new ClipboardItem({ [`text/html`]: blob })
  const resp = await navigator.clipboard.write([richTextInput])
  callback?.(true, data)

  return resp
}

export const Clipboard = {
  copy: copyToClipBoard,
  rich: copyRichTextToClipBoard,
  text: copyElementTextToClipBoard,
}