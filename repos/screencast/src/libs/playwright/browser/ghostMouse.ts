import type { GhostCursor, ClickOptions } from "ghost-cursor-pw"
import type { TLocatorOpts, TLocator, TBrowserPage, TLocatorClickOpts } from '@GSC/types'

import { isFunc } from '@keg-hub/jsutils'
import { createCursor } from "ghost-cursor-pw"

const pageProxyMethod = [
  `click`,
  `locator`,
  `getByAltText`,
  `getByLabel`,
  `getByPlaceholder`,
  `getByRole`,
  `getByTestId`,
  `getByText`,
  `getByTitle`,
  // TODO: add support for iframes
  // `frameLocator`
]

const mapClickOpts = (opts:TLocatorClickOpts):ClickOptions => {
  const {
    delay,
    force,
    timeout,
    // button,
    // position,
    // modifiers,
    // noWaitAfter,
  } = opts
  
  return {
    // maxTries,
    // moveSpeed,
    // moveDelay,
    waitForClick:delay,
    waitForSelector:timeout,
    maxTries: force ? 1 : 10,
  }
}

/**
 * Generates a Proxy object for Playwright Locators
 * allows us to trap the `locator.click` method, and 
 */
const createLocatorProxy = (
  cursor:GhostCursor,
  locator:TLocator,
  selector:string,
) => {
  const LocatorProxy = {
    get(target:TLocator, key:string) {
      if(key !== `click`){
        const value = Reflect.get(target, key)
        return isFunc(value) ? value.bind(target) : value
      }

      const clickMethod = async function(opts:TLocatorClickOpts){
        const clickOpts = opts ? mapClickOpts(opts) : undefined
        return async (...args:any[]) => await cursor.click(selector, clickOpts)
      }

      return clickMethod.bind(target)
    }
  }

  return new Proxy(locator, LocatorProxy) as TLocator
}


const createPageProxy = (page:TBrowserPage) => {
  const cursor = createCursor(page)

  const PageProxy = {
    get(target:TBrowserPage, key:string) {
      if(!pageProxyMethod.includes(key)){
        const value = Reflect.get(target, key)
        return isFunc(value) ? value.bind(target) : value
      }

      else if(key === `click`) return async (...args:any[]) => await cursor.click(...args)

      /**
       * Not currently supported
       * Would need to make changes to ghost-cursor-pw
       */
      else if(key === `frameLocator`){
        const orgFrameLocatorMethod = Reflect.get(target, key)
        const frameLocatorMethod = async function(selector:string){
          const frameLocator = await orgFrameLocatorMethod.apply(target, [selector])
          const iframeProxy = createPageProxy(frameLocator)
          return iframeProxy
        }

        return frameLocatorMethod.bind(target)
      }

      const locatorMethod = async function(selector:string, opts:TLocatorOpts){
        const orgLocatorMethod = Reflect.get(target, key)
        const locator = await orgLocatorMethod.apply(target, [selector, opts])
        const locatorProxy = createLocatorProxy(cursor, locator, selector)

        return locatorProxy
      }

      return locatorMethod.bind(target)

    }
  }

  return new Proxy(page, PageProxy) as TBrowserPage
}

/**
  * Call `page.click`
  * - Calls a proxy method which calls `cursor.click`
  * Call `page.locator`
  * - Calls a proxy method which calls the real `page.locator` method
  * - Then creates another proxy of the returned `Locator` and returns that to the caller
  * - When `locator.click` is called, calls the the proxy method `locator.click`
  * - The proxy method for `locator.click` then calls `cursor.click` passing in the locator
 */
export const ghostMouse = (page:TBrowserPage) => {
  const pageProxy = createPageProxy(page)

  return pageProxy as TBrowserPage
}
