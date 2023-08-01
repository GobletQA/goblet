
/**
 * This is a work around to fix methods that depended on the jasmine environment
 * This is in place until those can be updated
 */
export const JasmineCompat = {
  jasmine: {
    testPath: undefined,
    getEnv: () => {
      return {
        describe: () => {
          console.log(`------- NO OP Describe -------`)
        },
        addReporter: () => {
          console.log(`------- NO OP addReporter -------`)
        }
      }
    }
  }
}