// import type {
//   TElement,
//   THtmlNode,
//   THtmlParseOpts,
// } from '@GSC/types'

// import { parse } from 'parse5'

// const trashHtmlClasses = /^(text-|color-|flex-|float-|v-|ember-|d-|border-)/
// const regexChunks = /<\s*\w+(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+)))*\s*$/

// const isFilteredOut = (node:TElement, removeElements:string[]=[`path`, `script`]) => {
//   if (removeElements.includes(node.nodeName)) return true
//   if(!(node as THtmlNode)?.attrs) return false
  
//   return node.attrs.find((attr:Record<string, any>) => attr.name === `role` && attr.value === `tooltip`)
//     ? true
//     : false
// }

// const isInteractive = (node:TElement, opts:THtmlParseOpts) => {
//   const {
//     allowedRoles,
//     interactiveElements,
//   } = opts

//   if (node.nodeName === `input` && node.attrs.find(attr => attr.name === `type` && attr.value === `hidden`))
//     return false

//   if (interactiveElements.includes(node.nodeName))
//     return true

//   if (node?.attrs) {
//     if (node?.attrs?.find(attr => attr.name === `contenteditable`))
//       return true

//     if (node?.attrs?.find(attr => attr.name === `tabindex`))
//       return true

//     const role = node?.attrs?.find(attr => attr.name === `role`)
//     if (role && allowedRoles.includes(role.value))
//       return true
//   }

//   return false
// }

// const hasMeaningfulText = (node:TElement, opts:THtmlParseOpts) => {
//   const {
//     textElements
//   } = opts
  
//   return textElements.includes(node.nodeName)
//     ? true
//     : false
// }

// const hasInteractiveDescendant = (node:TElement, opts:THtmlParseOpts) => {
//   if (!node.childNodes) return false
//   let result = false

//   for (const childNode of node.childNodes) {
//     const element = childNode as THtmlNode
//     if (isInteractive(element, opts) || hasMeaningfulText(element, opts)) return true;
//     result = result || hasInteractiveDescendant(element, opts)
//   }

//   return result;
// }


// /**
//  * Helper to recursively remove Dom elements base on passed in options 
//  */
// export const cleanHtml = (node:TElement, opts:THtmlParseOpts) => {
//   const { allowedAttrs } = opts

//   if (node.nodeName !== `#document`) {
//     const parent = (node as THtmlNode).parentNode
//     const index = parent.childNodes.indexOf(node)

//     if (isFilteredOut(node)) {
//       parent.childNodes.splice(index, 1)
//       return true
//     }

//     // keep texts for interactive elements
//     if ((isInteractive(parent, opts) || hasMeaningfulText(parent, opts)) && node.nodeName === `#text`) {
//       node.value = node.value.trim().slice(0, 200)
//       if (!node.value) return false
//       return true
//     }

//     if (
//       // if parent is interactive, we may need child element to match
//       !isInteractive(parent, opts)
//       && !isInteractive(node, opts)
//       && !hasInteractiveDescendant(node, opts)
//       && !hasMeaningfulText(node, opts)) {
//       parent.childNodes.splice(index, 1)
//       return true
//     }
//   }

//   if (node.attrs)
//     node.attrs = node?.attrs?.filter(attr => {
//       const { name, value } = attr

//       if (name === `class`)
//         attr.value = value.split(' ')
//           .filter((className:string) => !/\d/.test(className))
//           .filter((className:string) => !className.match(trashHtmlClasses))
//           .filter((className:string) => !className.match(/(:|__)/))
//           .join(' ')

//       return allowedAttrs.includes(name)
//     })

//   if (node.childNodes)
//     for (let i = node.childNodes.length - 1; i >= 0; i--) {
//       const childNode = node.childNodes[i]
//       cleanHtml(childNode as THtmlNode, opts)
//     }

//   return false
// }

// export const sanitizeText = (node:TElement) => {
//   if (node.nodeName === `#text`)
//     return node.value.trim()

//   let sanitizedText = ''

//   if (node.childNodes)
//     for (const childNode of node.childNodes)
//       sanitizedText += sanitizeText(childNode as THtmlNode)

//   return sanitizedText
// }

// /**
//  * Helper to recursively scan for error classes and messages within the DOM
//  */
// export const scanErrors = (node:TElement, errorClasses:string[], errorMessages:string[]=[]) => {
//   if (node.attrs) {
//     const classAttr = node.attrs.find(attr => attr.name === 'class')
//     if (classAttr && classAttr.value) {
//       const classNameChunks = classAttr.value.split(' ')
//       const errorClassFound = errorClasses.some(errorClass => classNameChunks.includes(errorClass))
//       if (errorClassFound && node.childNodes) {
//         const errorMessage = sanitizeText(node)
//         errorMessages.push(errorMessage)
//       }
//     }
//   }

//   if (node.childNodes)
//     for (const childNode of node.childNodes)
//       scanErrors(childNode as THtmlNode, errorClasses, errorMessages)

//   return errorMessages
// }


export {}