import type { TExamConfig } from '@GEX/types'

import debug from 'debug'
import util from 'util'
import { Logger } from '@GEX/utils/logger'

export const debugDeepObj = (obj:any) => {
  const json = util.inspect(JSON.parse(JSON.stringify(obj)))
  console.log(json, {
    depth: null,
    colors: true,
    showHidden: false,
  })
}
