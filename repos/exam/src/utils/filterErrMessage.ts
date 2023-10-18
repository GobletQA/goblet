 import type { TExEventData } from "../types"
import { emptyObj } from "@keg-hub/jsutils/emptyObj"


export const spaceMap = {
  file: `  `,
  hook: `  `,
  spec: `  `,
  suite: `  `,
  root: `    `,
  error: `    `,
}

export const spaceFromId = (data:TExEventData) => {
  const { id, testPath } = data
  if(id.startsWith(`suite`)){
    let spacer = spaceMap.suite
    const [name, ...rest] = id.split(`-`)
    rest.map(num => spacer+=`  `)
    return spacer
  }

  let spacer = spaceMap.spec
  testPath.split(`/`).map(num => spacer+=`  `)
  return spacer

}

export type TErrMsgFilter = {
  end?:Array<string>
  start?:Array<string>
  contains?:Array<string>
}

const checkFilter = (
  trimmed:string,
  method:`includes`|`endsWith`|`startsWith`,
  filter:string
) => {

  const found = method === `includes`
    ? trimmed.match(new RegExp(filter, `gmi`))
    : method === `endsWith`
      ? trimmed.match(new RegExp(filter + `$`, `gmi`))
      : trimmed.match(new RegExp(`^` + filter, `gmi`))

  return Boolean(found && found.length)
}

export const filterErrMessage = (data:TExEventData, filter:TErrMsgFilter=emptyObj) => {
  const failed = data?.failedExpectations?.[0]
  if(!failed || !failed?.description) return ``

  const duplicates = []
  const endsWith = filter?.end ?? []
  const contains = filter?.contains ?? []
  const startsWith = filter?.start ?? [`===========================`]
  const extSpace = spaceFromId(data)

  const builtMsg = `${failed.description}`.split(`\n`)
    .map(line => {
      const trimmed = line.trim()

      if(!trimmed) return false
      if(duplicates.includes(line)) return false
      if(contains.find(filter => checkFilter(trimmed, `includes`, filter))) return false
      if(endsWith.find(filter => checkFilter(trimmed, `endsWith`, filter))) return false
      if(startsWith.find(filter => checkFilter(trimmed, `startsWith`, filter))) return false

      duplicates.push(line)
      return `${extSpace}${spaceMap.error}${line}`
    })
    .concat([
      data?.testPath && `\n${extSpace}${spaceMap.error}Test Path: ${data.testPath}`
    ])
    .filter(Boolean)
    .join(`\n`)

  // Hack to hide the timeout time due to the locators time being 99% of the Step definition time
  // Which allows us to get the real error, but causes the 99% time to be displayed instead
  // This can be removed once locatorTimeout is added to the step options object in the step def context
  return builtMsg.replaceAll(/timeout.*exceeded/gim, `Timeout exceeded`)
}
