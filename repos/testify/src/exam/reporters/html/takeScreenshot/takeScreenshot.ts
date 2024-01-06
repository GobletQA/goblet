 import {
  TExamEvt,
  TExEventData,
} from "@gobletqa/exam"

export type TTakeShot = {
  page?:any
  ext?:string
}

type TBuiltSSName = {
  id:string
  ext:string
  type:string
  timestamp:string|number
}

const getNameOpts = (data:TExEventData, opts:TTakeShot) => {
  return {
    id: data.id,
    ext: opts?.ext || `png`,
    timestamp: data?.timestamp
      || `${new Date().getTime()}`,
    type: data?.metaData?.type
      || data?.description?.split(` `).shift()?.trim?.()?.toLowerCase?.()
      || `test`
  }
  
}

/**
 * Builds the same of for a screen shot by cleaning up the passed in text and adding the extension param
 * @param {string} text - Text to be cleaned and used as the name
 * @param {string} ext - Extension to use for saving the screenshot
 *
 */
export const buildScreenshotName = (opts:TBuiltSSName) => {

  const {
    id,
    ext,
    type,
    timestamp
  } = opts

  let cleaned = id
    .replace(/[!@#$%^&*()_\\=+?:;"'<>,.{}|\/\[\]]/g, ` `)
    .trim()
    .replace(/\s/g, `-`)
    .toLowerCase()

  if(type) cleaned = cleaned.replace(`spec`, type)

  return `${cleaned}-${timestamp}.${ext}`
}


export const takeScreenshot = async (evt:TExamEvt<TExEventData>, opts:TTakeShot) => {
  const { page } = opts
  const buffer = await page?.screenshot()

  return {
    id: evt.data.id,
    uri: buffer.toString(`base64`)
  }
}