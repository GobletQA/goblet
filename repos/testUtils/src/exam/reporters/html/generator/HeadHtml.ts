import type { TExEventData } from "@gobletqa/exam"
import { Styles } from './styles'

export const HeadHtml = (response:TExEventData, title:string) => {
  return `
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="author" content="">
    <meta name="keywords" content="">
    <meta name="description" content="">
    <title>${title}</title>
    ${Styles(response)}
  </head>
  `
}