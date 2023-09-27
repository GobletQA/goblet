### Keeping this as a reference, but it's not being used

> **IMPORTANT**
> To use this be sure to install the pacakge `source-map-support` as well

```ts
import url from 'url'
import { wrapCallSite } from 'source-map-support'

type TAddLocFun = <R=any>(location: Location, ...args: any[]) => R
type TAddLocReturnFun = <R=any>(...args:any[]) => R
type TStackLoc = {stack: Location}

/**
 * Adds location / line / column information to a function call
 * Useful for tracking where errors happened in code
 * Could be used in exam when a test file is transformed with esbuild
 * Need to investigate more though
 */
export const addStackLoc = (func:TAddLocFun):TAddLocReturnFun => {
  return (...args) => {
    // Monkey patch the prepareStackTrace method on the global Error object
    // So we cna capture the original stackFrames and generate the file / line / column data
    const oldPrepareStackTrace = Error.prepareStackTrace
    Error.prepareStackTrace = (error, stackFrames) => {

      const frame: NodeJS.CallSite = wrapCallSite(stackFrames[1])
      const fileName = frame.getFileName()

      // Node error stacks for modules use file:// urls instead of paths.
      const file = (fileName && fileName.startsWith('file://'))
        ? url.fileURLToPath(fileName)
        : fileName

      return {
        file,
        line: frame.getLineNumber(),
        column: frame.getColumnNumber(),
      }
    }

    // Monkey paths the stackTraceLimit so we can remove our internal method calls
    const oldStackTraceLimit = Error.stackTraceLimit
    Error.stackTraceLimit = 2

    // Create a new stack trace on an empty object
    // Which allows us to capture the location information
    const obj:TStackLoc = {} as TStackLoc
    Error.captureStackTrace(obj)
    const location = obj.stack

    // Reset the monkey patches on the error object
    Error.stackTraceLimit = oldStackTraceLimit
    Error.prepareStackTrace = oldPrepareStackTrace

    // Call the callback, adding in the location information
    return func(location, ...args)
  }

}
```