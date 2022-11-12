import type {
  TBrowserConf,
  TPWComponent,
  TStartPlaying,
  TBrowserAction,
  TActionCallback,
  TStartRecording,
  TBrowserActionArgs,
} from '@GSC/types'

import { Player }  from '../player/player'
import { startBrowser } from './startBrowser'
import { Recorder }  from '../recorder/recorder'
import { isArr, isStr, isFunc, noPropArr } from '@keg-hub/jsutils'

/**
 * Helper to thrown an error
 * @param {string} message - Error message to throw
 */
const throwErr = (message:string) => {
  throw new Error(message)
}

/**
 * Helper to validate the correct arguments exist to run the actions
 */
const validateArgs = (
  args:Record<any, any>,
  component:string
) => {
  const { ref, actions = noPropArr, id } = args

  if (!isStr(id)) throwErr(`Invalid authorization id`)

  if (!isStr(ref))
    throwErr(`Playwright ${ref} must be one of browser, context, or page`)

  if (!component)
    throwErr(
      `Playwright ${ref} does not exist. Must be one of browser, context, or page`
    )

  if (!isArr(actions))
    throwErr(
      `Actions must be an array of actions to execute on a Playwright ${ref}`
    )
}

/**
 * Calls a method on a playwright component (browser, context, page)
 */
const callAction = async (
  action:TBrowserAction,
  component:TPWComponent,
  pwComponents:Record<string, TPWComponent>,
  prevResp:any[]
) => {
  const comp = pwComponents[action.ref] || component
  // Ensure props is an array
  const props = isArr(action.props) ? [...action.props] : []

  // Add the previous response to the props array if it exists and action.prev is true
  action.prev === true && prevResp && props.unshift(prevResp)

  return isFunc<TActionCallback>(comp[action.action as string])
    ? await (comp[action.action as string])(...props)
    : throwErr(
        `Playwright ${action.ref} must be one of browser, context, or page`
      )
}

/**
 * Execute an action on a browser
 */
export const startRecording = async (data:TStartRecording) => {
  const {
    id,
    action,
    onCleanup,
    browserConf,
    pwComponents,
    onRecordEvent,
    onCreateNewPage,
  } = data

  const { props, action:method } = action

  const [recordOpts, url] = props
  const browserItems = pwComponents || await startBrowser(browserConf)

  const recorder = Recorder.getInstance(id, {
    onCleanup,
    onCreateNewPage,
    ...browserItems,
    options: recordOpts,
    onEvent: onRecordEvent,
  })

  return await recorder.start({ url })
}


export const startPlaying = async (data:TStartPlaying) => {
  const {
    id,
    repo,
    action,
    onCleanup,
    browserConf,
    onPlayEvent,
    pwComponents,
    onCreateNewPage,
  } = data

  const { props, action:method } = action
  const [playerOpts, url] = props
  const browserItems = pwComponents || await startBrowser(browserConf)

  const player = Player.getInstance(id, {
    onCleanup,
    onCreateNewPage,
    ...browserItems,
    onEvent: onPlayEvent,
  })

  return await player.start({ options: playerOpts, repo })
}

/**
 * Execute an action on a browser
 * @param {Object} args
 * @param {string} [args.ref='browser'] - Reference to a playwright component (browser, context, or page)
 * @param {array} [args.actions=[]] - List of actions to execute on the ref
 *
 * @example
 * // Should open a browser page and navigate to google.com
 * actionBrowser({
 *  ref: 'page',
 *  actions: [{
 *    action: 'goto',
 *    props: [`https://google.com`]
 *  }]
 * })
 *
 * @returns {Array} - Responses of all executed actions in order of execution
 */
export const actionBrowser = async (
  args:TBrowserActionArgs,
  browserConf:TBrowserConf
) => {
  const { ref = 'browser', actions = noPropArr, id, onRecordEvent } = args
  const pwComponents = await startBrowser(browserConf)
  const component = pwComponents[ref]
  validateArgs(args, component)

  const responses = []
  return actions.reduce(async (toResolve, action) => {
    await toResolve
    const prevResp = responses[responses.length - 1]

    // If the action if a method, cal if an pass the callAction method and params
    const resp = isFunc<TActionCallback>(action.action)
      ? await action.action(
          callAction,
          action,
          component,
          pwComponents,
          prevResp,
          responses,
          id
        )
      : action.action === 'record'
        ? await startRecording({
            id,
            action,
            browserConf,
            pwComponents,
            onRecordEvent,
          })
        : await callAction(
            action,
            component,
            pwComponents,
            prevResp
          )

    responses.push(resp)

    return responses
  }, Promise.resolve())
}
