import type { TExamCliOpts } from '../types/bin.types'

import { options } from './options'
import { getConfig } from './getConfig'
import { argsParse } from '@keg-hub/args-parse'
import { Exam } from '../Exam'


const onEvent = (event:any) => {
  console.log(`------- event -------`)
  console.log(event)
}

;(async () => {

  const args = process.argv.slice(2) as string[] 
  const opts = await argsParse({ args, task: { options }}) as TExamCliOpts
  const config = getConfig(opts)
  const exam = new Exam(config, `test-id`)

  const resp = await exam.run({
    onEvent,
    // file: `__mocks__/test-file.ts`,
    testMatch: `__mocks__/__tests__/*`,
    // TODO: fix loading files without an extension
    // file: `__mocks__/test-file`
  })
  
  console.log(`------- resp -------`)
  console.log(resp)


})()