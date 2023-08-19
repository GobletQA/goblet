import type { TWorldConfig } from '@ltipton/parkin'
import type {
  TClickEl,
  TStepCtx,
  TLocator,
  TFillInput,
  TSaveWorldLocator,
} from '@GTU/Types'

import { Logger } from '@gobletqa/logger'
import { get } from '@keg-hub/jsutils/get'
import { set } from '@keg-hub/jsutils/set'
import { ENVS } from '@gobletqa/environment'
import { unset } from '@keg-hub/jsutils/unset'
import { isNum } from '@keg-hub/jsutils/isNum'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { getPage, getLocator } from '@GTU/Playwright'
import {
  SavedDataWorldPath,
  SavedLocatorWorldPath,
  AutoSavedDataWorldPath,
  AutoSavedLocatorWorldPath
} from '@GTU/Constants'

const checkTypes = {
  less: {
    match: [`less`, `<`],
    method: (val, count) => {
      Logger.stdout(`Expect ${val} to be less-then ${count}`)
      expect(val).toBeLessThan(count)
    }
  },
  greater: {
    match: [`greater`, `>`],
    method: (val, count) => {
      Logger.stdout(`Expect ${val} to be greater-then ${count}`)
      expect(val).toBeGreaterThan(count)
    }
  },
  equal: {
    match: [ `equal`, `=`, `==`, `===`],
    method: (val, count) => {
      Logger.stdout(`Expect ${val} to be equal to ${count}`)
      expect(val).toEqual(count)
    }
  },
  lessEqual: {
    match: [`less-equal`, `<=`],
    method: (val, count) => {
      Logger.stdout(`Expect ${val} to be less-then or equal to ${count}`)
      expect(val).toBeLessThanOrEqual(count)
    }
  },
  greaterEqual: {
    match: [`greater-equal`, `>=`],
    method: (val, count) => {
      Logger.stdout(`Expect ${val} to be greater-then or equal to ${count}`)
      expect(val).toBeGreaterThanOrEqual(count)
    }
  }
}

const compareTypes = [
  `contains`,
  `matches`
] 

/**
 * Expects the number of dom elements matching `selector` to match `count` based on the comparison screen
 * @param {number} count1 - original count amount
 * @param {number} count2 - next count amount
 * @param {string} type - The type being counted
 */
export const greaterLessEqual = (
  count1:number,
  count2:number,
  type:string
) => {
  const foundType = Object.entries(checkTypes)
    .find(([key, def]) => def.match.includes(type))
  
  if(!foundType)
    throw new Error(`Invalid type. Must be one of ${greaterLessEqual.matchTypes}`)

  foundType[1].method(count1, count2)
}
/**
 * Builds the match types from the checkTypes and adds to the greaterLessEqual method
 * Allows them to be accessible when using this method
 */
greaterLessEqual.matchTypes = Object.entries(checkTypes)
  .reduce((types, [key, def]) => {
    types.push(...def.match)
    return types
  }, [])
  .join(', ')


/**
 * Cleans the passed in world path to ensure world || $world is not the start of the string
 * @param {string} worldPath - Path on the world object
 *
 */
export const cleanWorldPath = (worldPath:string) => {
  const pathArr = worldPath.trim().split(`.`).filter(part => Boolean(part.trim()))
  const noWorld = pathArr[0] === '$world' || pathArr[0] === 'world' ? pathArr.slice(1) : pathArr

  const cleaned = noWorld.filter(Boolean).join('.').trim()
  if(!cleaned) throw new Error(`Can not use world path "${worldPath}". It is not a valid path.`)
  
  return cleaned
}

/**
 * Removes the value on the world object at the passed in path
 *
 */
export const clearWorldPath = (worldPath:string, world:TWorldConfig) => {
  const cleaned = cleanWorldPath(worldPath)
  unset(world, cleaned)
}

/**
 * Finds the element matching selector returned from selectorAlias
 * And registers it as the current ancestor
 *
 */
export const saveWorldData = (
  data:Record<string, any>=emptyObj,
  world:TWorldConfig,
  worldPath?:string,
) => {
  const cleaned = worldPath
    ? cleanWorldPath(worldPath)
    : AutoSavedDataWorldPath

  set(world, cleaned, data)

  return data
}

/**
 * Finds the element matching selector returned from selectorAlias
 * And registers it as the current ancestor
 *
 */
export const saveWorldLocator = async (props:TSaveWorldLocator, ctx?:TStepCtx) => {
  const {
    world,
    selector,
    worldPath
  } = props

  const element = props.element || getLocator(selector)
  const cleaned = worldPath
    ? cleanWorldPath(worldPath)
    : AutoSavedLocatorWorldPath

  set(world, cleaned, { selector, element })

  return element
}

/**
 * Gets the data from the passed in world path and world object 
 *
 */
export const getFromWorldPath = (
  worldPath:string,
  world:TWorldConfig,
  fallback?:any
) => {
  const cleaned = cleanWorldPath(worldPath)
  return get(world, cleaned, fallback)
}

export const getWorldData = (
  world:TWorldConfig,
  worldPath?:string,
  fallback?:any
) => {
  const saved = worldPath
    ? getFromWorldPath(worldPath, world, fallback)
    : get(world, SavedDataWorldPath, get(world, AutoSavedDataWorldPath, fallback))

  if(saved === undefined)
    throw new Error(`Saved value "$world.${worldPath}" does not exist.`)

  return saved
}

export const getWorldLocator = (
  world:TWorldConfig,
  worldPath?:string,
  fallback?:any
) => {
  const saved = worldPath
    ? getFromWorldPath(worldPath, world, fallback)
    : get(world, SavedLocatorWorldPath, get(world, AutoSavedLocatorWorldPath, fallback))

  if(saved === undefined){
    if(worldPath)
      throw new Error(`Saved value "$world.${worldPath}" does not exist.`)
    
    console.log(SavedLocatorWorldPath)
    console.log(AutoSavedLocatorWorldPath)

  }

  return saved
}

/**
 * Compares the content of two values, either contains or exact matching 
 *
 */
export const compareValues = (
  val1:any,
  val2:any,
  type:string
) => {
  if(!compareTypes.includes(type))
    throw new Error(`Compare type "${type}" is invalid. Must be one of "${compareTypes.join(', ')}".`)

  type === `contains`
    ? expect(val1).toEqual(expect.stringContaining(val2))
    : expect(val1).toEqual(val2)
}

/**
 * Calls a method on a found locator
 *
 */
export const callLocatorMethod = async (
  selector:string,
  prop:string,
  locator?:TLocator,
  ctx?:TStepCtx
) => {
  const element = locator || getLocator(selector)
  if(!element[prop])
    throw new Error(`Selected Element ${selector} missing prop method "${prop}".`)

  return await element[prop]()
}

export const getLocatorAttribute = async (
  selector:string,
  attr:string,
  locator?:Record<string, any>,
  ctx?:TStepCtx
) => {
  const element = locator || getLocator(selector)
  const timeout = getStepTimeout(ctx)
  return await element.getAttribute(attr, { timeout })
}

export const getLocatorProps = async (
  selector:string,
  locator?:TLocator,
  ctx?:TStepCtx
) => {
  const element = locator || getLocator(selector)

  // TODO: Add more properties to the returned object
  return await element.evaluate(elm => {
    // Hack so typescript doesn't lose it's mind
    const el = elm as any

    return {
      id: el.id,
      role: el.role,
      value: el.value,
      title: el.title,
      hidden: el.hidden,
      tagName: el.tagName,
      tabIndex: el.tabIndex,
      nodeName: el.nodeName,
      className: el.className,
      scrollTop: el.scrollTop,
      clientTop: el.clientTop,
      localName: el.localName,
      innerHTML: el.innerHTML,
      innerText: el.innerText,
      outerHTML: el.outerHTML,
      outerText: el.outerText,
      draggable: el.draggable,
      offsetTop: el.offsetTop,
      offsetLeft: el.offsetLeft,
      clientLeft: el.clientLeft,
      scrollLeft: el.scrollLeft,
      scrollWidth: el.scrollWidth,
      offsetWidth: el.offsetWidth,
      clientWidth: el.clientWidth,
      isConnected: el.isConnected,
      textContent: el.textContent,
      clientHeight: el.clientHeight,
      scrollHeight: el.scrollHeight,
      offsetHeight: el.offsetHeight,
      namespaceURI: el.namespaceURI,
      contentEditable: el.contentEditable,
      childElementCount: el.childElementCount,
      isContentEditable: el.isContentEditable,
      style: Object.assign({}, el.style),
      dataset: Object.assign({}, el.dataset)
    }
  })
}

export const getLocatorTagName = async (
  selector:string,
  locator?:TLocator,
  ctx?:TStepCtx
) => {
  const element = locator || getLocator(selector)
  return await element.evaluate((el:HTMLElement) => el.tagName)
}

export const getLocatorContent = async (
  selector:string,
  locator?:TLocator,
  ctx?:TStepCtx
) => {
  const timeout = getStepTimeout(ctx)
  const element = locator || getLocator(selector)
  const tagName = await getLocatorTagName(selector, element, ctx)

  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT'
    ? await element.inputValue({ timeout })
    : await element.textContent({ timeout })
}

/**
 * Finds an element from selector or locator, and clicks it
 * @param {TClickEl} params
 *
 */
export const clickElement = async ({
  save,
  timeout,
  locator,
  selector,
  worldPath=AutoSavedLocatorWorldPath,
  ...opts
}:TClickEl, ctx?:TStepCtx) => {

  locator = locator || getLocator(selector)

  timeout = timeout || getStepTimeout(ctx)

  // TODO: figure out if trial should be used to ensure the element exists
  // await locator.click({ ...opts, trial: true, timeout })

  await locator.click({ ...opts, timeout })

  // Save the most recent world data
  save && saveWorldData({ selector, element:locator }, ctx?.world, worldPath)

  return { locator }
}


/**
 * Finds an input from selector or locator, then fills it with the text
 *
 */
export const fillInput = async (props:TFillInput, ctx?:TStepCtx) => {
  const { text } = props
  const { locator } = await clickElement(props, ctx)

  //clear value before setting otherwise data is appended to end of existing value
  await locator.fill('')
  await locator.fill(text)

  return { locator }
}

/**
 * Finds an input from selector or locator, then fills it with the text
 *
 */
export const clearInput = async (props:TClickEl, ctx?:TStepCtx) => {
  const { locator } = await clickElement(props, ctx)

  // clear value of the input
  await locator.fill('')

  return { locator }
}


/**
 * Finds an input from selector or locator, then types in the text
 *
 */
export const typeInput = async (props:TFillInput, ctx?:TStepCtx) => {
  const { text } = props
  const { locator } = await clickElement(props, ctx)

  //clear value before setting otherwise data is appended to end of existing value
  await locator.type('')
  await locator.type(text)

  return { locator }
}

/**
 * Gets the configured timeout for a step based on the possible timeout locations
 */
export const getStepTimeout = (ctx?:TStepCtx) => {
  const globalTimeout = global?.getParkinOptions?.()?.timeout

  const timeout = ctx?.options?.timeout
    || ENVS.GOBLET_TEST_TIMEOUT
    || global.__goblet?.browser?.timeout
    || globalTimeout
    || 15000

  return isNum(timeout) ? timeout : parseInt(timeout, 10)
}