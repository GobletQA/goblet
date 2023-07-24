import type { TExamCliOpts } from '../types/bin.types'


import { options } from './options'
import { getConfig } from './getConfig'
import { argsParse } from '@keg-hub/args-parse'
import { Exam } from '../Exam'

;(async () => {

  const args = process.argv.slice(2) as string[] 
  const opts = await argsParse({ args, task: { options }}) as TExamCliOpts
  const config = getConfig(opts)
  
  const exam = new Exam(config, `test-id`)

  const resp = await exam.run({
    // TODO: fix loading files without an extension
    // file: `__mocks__/test-file`
    preEnvironment: {
      
    },
    file: `__mocks__/test-file.ts`
  })
  
  console.log(`------- resp -------`)
  console.log(resp)


})()