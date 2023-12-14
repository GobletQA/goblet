// import type { Repo } from '@GSC/types'
// import type { Repo, TJokerActExt } from '@GSC/types'
// import type { TJokerReq, TJokerRes } from '@gobletqa/joker'

// import { EPromptRole, EAIModel } from '@gobletqa/joker'
// import { Logger } from '@GSC/utils/logger'
// import { isStr } from '@keg-hub/jsutils/isStr'
// import { limbo } from '@keg-hub/jsutils/limbo'
// import { nanoid } from '@keg-hub/jsutils/nanoid'
// import { wait } from '@keg-hub/jsutils/wait'
// import { jokerAI } from '@gobletqa/joker/jokerAI'
// import { ProcessHtml } from './html/processHtml'
// import { GBrowser, scrapePage } from '@gobletqa/browser'
// import { capitalize } from '@keg-hub/jsutils/capitalize'
// import { loadDefinitions } from '@gobletqa/shared/libs/definitions/definitions'

// const jokerMessage = {
//   id: 'chatcmpl-37PnXG4HB33nuupEYk2tZQ',
//   object: 'chat.completion',
//   created: 1697907105,
//   model: 'codellama-34b',
//   choices: [
//     {
//       index: 0,
//       message: {
//         role: 'assistant',
//         content: 'Here is an example of a Feature file that performs the action of entering an email address and clicking a button:\n' +
//           '```\n' +
//           'Feature: Enter email and click button\n' +
//           '\n' +
//           '  Scenario: Enter email and click button\n' +
//           '    Given I am on the homepage\n' +
//           '    When I enter "lance@gobletqa.com" into the email input\n' +
//           '    And I click the "Request demo" button\n' +
//           '    Then I should see a confirmation message\n' +
//           '```\n' +
//           'This Feature file uses the Gherkin syntax to define a scenario that describes the desired behavior of the system. The scenario consists of three steps:\n' +
//           '\n' +
//           '1. The first step, `Given I am on the homepage`, is a precondition that sets the context for the scenario. It indicates that the user is on the homepage of the website.\n' +
//           '2. The second step, `When I enter "lance@gobletqa.com" into the email input`, is the action that the user takes. It describes the user entering an email address into an input field.\n' +
//           '3. The third step, `And I click the "Request demo" button`, is the action that the user takes after entering the email address. It describes the user clicking a'
//       },
//       finish_reason: 'stop'
//     }
//   ],
//   usage: {
//     "prompt_tokens": 16,
//     "total_tokens": 96,
//     "completion_tokens": 80
//   },
// }

// const mockQResp = () => {
//   return new Promise((res) => {
//     setTimeout(() => {
//       res(jokerMessage)
//     }, 3000)
//   })
// }



// const builtJokerReq = (
//   prompt:string,
//   url:string,
//   html:string,
//   steps:string
// ) => {
//   return {
//     questions: [
//       `You are QA test engineer writing a Feature file in Gherkin syntax for a web page`,
//       `The web page contains the following HTML:`,
//       ` \`\`\`${html}\`\`\``,
//       `Write a Feature file to perform this action:`,
//       `\`\`\`${prompt}\`\`\``,
//       `The Feature file can only use steps from this list:`,
//       `\`\`\`${steps}\`\`\``,
//       `The expressions of each step should be replace with valid CSS selectors from web page HTML or from the action`,
//       `The steps must come from the provided list. If the list does not contain a step to perform the action, the action should be skipped. Do NOT make up new steps. Use only steps from the provided list.`
//       // `The expressions in each step should be replaced with valid CSS selectors from web page HTML`,
//     ]
    
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
//   }
// }

// const getStepList = async (repo:Repo) => {
//   // Ensure we load the most recent definitions, to ensure changes to custom defs are loaded
//   const loaded = await loadDefinitions(repo)

//   return `\n${
//     loaded.reduce((acc, file) => {
//       file?.ast?.definitions
//         && acc.push(...file?.ast?.definitions.map(def => `${capitalize(def.type)} ${def.match}`))
      
//       return acc
//     }, [] as string[]).join(`\n`)
//   }\n`
// }

// export const stepFromBrowserAndPrompt = async (props:TJokerReq, ext:TJokerActExt) => {
  
  // return await mockQResp()
  
  // const { id, text, data } = props
  // const { repo } = ext
  
  // const pwComponents = ext.pwComponents
  //   || await GBrowser.start({ browserConf: ext.browserConf, config: repo })

  // const contentProm = scrapePage({
  //   pwComponents,
  //   url: data?.url,
  //   browserConf: ext.browserConf,
  // })

  // const stepsProm = getStepList(repo)

  // const [content, steps] = await Promise.all([contentProm, stepsProm])

  // const processHtml = new ProcessHtml(repo.world?.joker?.html)
  // const html = processHtml.process(content)
  // const req = builtJokerReq(
  //   text,
  //   data?.url,
  //   html,
  //   steps
  // )

  // console.log(require('util').inspect(html, false, null, true))
  // console.log(html)

  // const [err, resp] = await limbo<TJokerRes>(jokerAI.ask({id, ...req}))

  // if(err){
  //   err && Logger.log(err.stack)
  //   return {
  //     error: true,
  //     message: err.message,
  //     data: { id: nanoid(), requestId: id, ...resp } as TJokerRes,
  //   }
  // }

  // return resp

// }

export {}