// import type { parse, DefaultTreeAdapterMap } from 'parse5'
// type TDocument = ReturnType<typeof parse<DefaultTreeAdapterMap>> & {
//   attrs?:any
// }
// export type TElement = TDocument|THtmlNode
// import type { Options as THtmlMinifyOpts } from 'html-minifier'

export type THtmlParseOpts = {
  textElements?:string[]
  allowedAttrs?:string[]
  allowedRoles?:string[]
  interactiveElements?:string[]
}

export type TProcessHtmlOpts = {
  parse:THtmlParseOpts
  // minify:THtmlMinifyOpts
}

type THtmlNodeAttrs = {
  name:string
  value:string
}

export type TElement = THtmlNode

export type THtmlNode = {
  nodeName:string
  attrs:THtmlNodeAttrs[]
  childNodes?:THtmlNode[]
  [key:string]:any
}


// export {
//   THtmlMinifyOpts
// }