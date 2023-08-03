

/**
 * This is not currently being used, so commenting out for now
 * It may be possible to come up with a solution to do this down the road, so keeping it around for now
 */
// import { setBrowserDefaults } from '@gobletqa/screencast/libs/playwright/browser/setBrowserDefaults'
// import { getContext, closeContext, getPage } from './browserContext'
// export const restartContext = async (ctx:TStepCtx) => {
//   const { world } = ctx
  
//   // global.__goblet.context.options // Browser Context Options
//   // global.__goblet.context.options.recordVideo // string path to video save directory
//   // global.context.__goblet.cookie // string path to saved cookie
//   // global.context.__goblet.extraHTTPHeaders // Record<string, string>
//   // global.context.__goblet.tracing // boolean
//   // const gobletCtxOpts = global?.context?.__goblet || {}

//   // Cache the url so we can reset it
//   const _page = await getPage()
//   const url = _page.url()

//   await closeContext()

//   const context = await getContext()
//   const page = await getPage()
//   setBrowserDefaults({
//     url,
//     repo: { world },
//     browserConf: global.browser.__goblet,
//     pwComponents: { context, page } as TPWComponents
//   })

// }

export {}