import type { TLocator, TBrowserPage } from '@GTU/Types'
import { getPage } from '@GTU/Playwright'

export type TRunInBrowser = {
  opts?:Record<string, any>
  selector?:string
  locator?:TLocator
  cb?:(...args:any[]) => any,
}

export type TMediaIsPlayingLoc = {
  selector?:never
  locator:TLocator
}

export type TMediaIsPlayingSel = {
  selector:string
  locator?:never
}


export const runInBrowser = async (
  props:TRunInBrowser,
  callback:(...args:any[]) => any
) => {
  const {
    cb=callback,
    opts,
    locator,
    selector,
  } = props

  if(!cb) throw new Error(`A callback method is required when calling the runInBrowser function`)

  if(!selector && !locator){
    const page = await getPage()
    return await page.evaluate(cb, opts)
  }

  let element:TLocator=locator
  if(!element && selector){
    const page = await getPage()
    element = page.locator(selector)
  }

  if(!element) throw new Error(`Can not run method in browser. Parent locator could not be found.`)

  return await element.evaluate(cb, opts)
}


export const mediaPlay = async (props:TMediaIsPlayingSel|TMediaIsPlayingLoc) => {
  return await runInBrowser(props, (element) => {
    return element instanceof HTMLMediaElement
      && element.play()
  })
}

export const mediaStop = async (props:TMediaIsPlayingSel|TMediaIsPlayingLoc) => {
  return await runInBrowser(props, (element) => {
    return element instanceof HTMLMediaElement
      && element.pause()
  })
}

export const mediaIsPlaying = async (props:TMediaIsPlayingSel|TMediaIsPlayingLoc) => {
  return await runInBrowser(props, (element) => {
    return element instanceof HTMLMediaElement
      && element.currentTime > 0
      && !element.paused
      && !element.ended
      && element.readyState > 2
  })
}

export const mediaIsFinished = async (props:TMediaIsPlayingSel|TMediaIsPlayingLoc) => {
  return await runInBrowser(props, (element) => {
    return element instanceof HTMLMediaElement && element.ended
  })
}

