import { Exam } from '../Exam'
import { getConfig } from './getConfig'
import { removeEmpty, parseArgs } from './helpers'

const onEvent = (event:any) => {
  console.log(`------- event -------`)
  console.log(event)
}

;(async () => {

  const config = await parseArgs()
    .then(getConfig)
    .then(removeEmpty)
  
  new Exam(config, `test-id`).run({

    // onEvent,
    // file: `__mocks__/test-file.ts`,
    // testMatch: `__mocks__/__tests__/*`,
    // TODO: fix loading files without an extension
    file: `__mocks__/test-file`
    // file: `__mocks__/duper`

  })
  // .then(console.log)
  .then((results) => console.log(`Tests Passed`))
  .catch(console.error)

})()