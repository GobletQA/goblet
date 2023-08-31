import type { TLocEvtData } from "@gobletqa/exam"
import { HeadHtml } from './parts/HeadHtml'
import { BodyHtml } from './parts/BodyHtml'

export type THTMLTemplate = {
  response:TLocEvtData
  reportTitle?:string
  currentDate?:string
}

const buildTitle = (response:TLocEvtData, reportTitle?:string) => {
  if(reportTitle) return reportTitle

  if(response.location)
    return response.location.split(`/`)
      .pop()
      .split('.')
      .shift()
      .trim()
      .replace(/[-_]/g, ' ')

  const description = response?.describes?.[0]?.description
  if(!description) return `Goblet Test Report`

  return description.includes(`>`)
    ? description.split(`>`).pop().trim()
    : description.trim().replace(/^feature/gi, ``)
}

export const htmlTemplate = ({
  response,
  currentDate=new Date().toLocaleString(),
  reportTitle,
}:THTMLTemplate) => {
  const title = buildTitle(response, reportTitle)

  return `
    <!DOCTYPE html>
    <html>
      ${HeadHtml(response, title)}
      ${BodyHtml(response, currentDate, title)}
    </html>
  `
}