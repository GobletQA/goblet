 import type { TExamEvt, TLocEvtData } from "@gobletqa/exam"
import fs from 'fs'
import { htmlTemplate } from './htmlTemplate'

export type TGenHtmlOpts = {
  debug?:boolean
  location?:string
}

export const generateHtml = (evt:TExamEvt<TLocEvtData>, opts?:TGenHtmlOpts) => {
  const outputLoc = opts?.location
  
  // Generate HTML report
  const htmlReport = htmlTemplate({ response: evt.data })
  if(!outputLoc) return htmlReport

  // Write the HTML report to a file
  fs.writeFileSync(outputLoc, htmlReport)
  opts?.debug && console.log(`HTML report generated at ${outputLoc}`)

  return htmlReport
}