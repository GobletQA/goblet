// import type { TProcessHtmlOpts } from '@GSC/types'

// import { minify as minifyHtml } from 'html-minifier'
// import { parse, serialize } from 'parse5'
// import { DefaultProcessHtmlOpts } from '@GSC/constants/html'
// import {
//   cleanHtml,
//   scanErrors,
// } from './htmlHelpers'

// export class ProcessHtml {
//   private options: TProcessHtmlOpts;

//   constructor(opts?:TProcessHtmlOpts) {
//     this.options = {
//       parse: {...DefaultProcessHtmlOpts.parse, ...opts?.parse},
//       minify: {...DefaultProcessHtmlOpts.minify, ...opts?.minify},
//     }
//   }

//   #minify = (html:string) => {
//     return minifyHtml(html, this.options.minify).toString()
//   }

//   #clean = (html: string) => {
//     const document = parse(html)
//     cleanHtml(document, this.options.parse)

//     return serialize(document)
//   }

//   #scanErrors = (html:string, errorClasses:string[] = []) => {
//     const document = parse(html)
//     return scanErrors(document, errorClasses)
//   }

//   process = (html?:string) => {
//     const cleaned = this.#clean(html)
//     const mini = this.#minify(cleaned)

//     return mini
//   }

// }

// export default ProcessHtml

export {}