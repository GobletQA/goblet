import type { TJokerActExt } from '@GSC/types'
import type { TJokerReq, TJokerRes } from '@gobletqa/joker'

import { EPromptRole, EAIModel } from '@gobletqa/joker'
import { Logger } from '@GSC/utils/logger'
import { isStr } from '@keg-hub/jsutils/isStr'
import { limbo } from '@keg-hub/jsutils/limbo'
import { nanoid } from '@keg-hub/jsutils/nanoid'
import { jokerAI } from '@gobletqa/joker/jokerAI'
import { ProcessHtml } from './html/processHtml'
import { capitalize } from '@keg-hub/jsutils/capitalize'
import { GBrowser, scrapePage } from '@gobletqa/browser'
import { loadDefinitions } from '@gobletqa/shared/libs/definitions/definitions'


const builtJokerReq = (
  prompt:string,
  url:string,
  html:string,
  steps:string[]
) => {
  return {
    // model: EAIModel.CodeLlama34,
    question: [
      `Write feature steps in the gherkin syntax that does the following:`,
      prompt,
      `The feature should use few steps as possible, and only steps from the provided list of steps.`,
      `Do not make up or create new steps that are not in the provided list.`,
      `Use only the provided HTML to generate the expressions for each step`,
      `Your response should include only the feature file steps and nothing else`,
      `Here is the provided list of steps:`,
      steps.join(`\n`),
      `Here is provided HTML:`,
      html,
    ].join(`\n`)
    
    // question: `Using the following html content:\n${html}\n. Write Feature file steps using the Gherkin syntax to preform the following:\n${prompt}\n. Use only steps from the following list:\n${steps.join(`\n`)}\n`,
    // questions: [
    //   {
    //     role: EPromptRole.user,
    //     content: `I am test engineer writing steps in a Feature file using the Gherkin syntax. Only the following steps are allowed to be used:\n${steps.join(`\n`)}`
    //   },
    //   {
    //     role: EPromptRole.user,
    //     content: `I have opened web page to ${url}, which contains the following HTML:\n${html}`,
    //   },
    //   {
    //     role: EPromptRole.user,
    //     content: `Using only the provided steps and HTML in your response, I want you to write steps to do the following: ${prompt}`
    //   },
    // ]
  }
}


export const stepFromBrowserAndPrompt = async (props:TJokerReq, ext:TJokerActExt) => {
  const { id, text, data } = props
  const { repo } = ext
  
  const pwComponents = ext.pwComponents
    || await GBrowser.start({ browserConf: ext.browserConf, config: repo })

  const content = await scrapePage({
    pwComponents,
    url: data?.url,
    browserConf: ext.browserConf,
  })

  // Ensure the definitions are loaded into the repo.parkin instance
  await loadDefinitions(repo)
  const stepList = repo?.parkin?.steps?.list?.()
    .map(def => `${capitalize(def.type)} ${def.match}`)

  const processHtml = new ProcessHtml(repo.world?.joker?.html)
  const html = processHtml.process(content)
  const req = builtJokerReq(
    text,
    data?.url,
    html,
    stepList
  )
  
  const [err, resp] = await limbo<TJokerRes>(jokerAI.ask({id, ...req}))

  if(err){
    err && Logger.log(err.stack)
    return {
      error: true,
      message: err.message,
      data: { id: nanoid(), requestId: id, ...resp } as TJokerRes,
    }
  }


  console.log(`------- resp -------`)
  console.log(resp)

  return resp


}