import type {
  TJokerOpts,
  TJokerAsk,
  TSystemMsg,
} from '@GJK/types'
import { EPromptRole } from '@GJK/types'

import { isStr } from '@keg-hub/jsutils/isStr'
import { buildQuestion } from '@GJK/utils/buildQuestion'
import { getProvider } from '@GJK/providers/getProvider'
import { BaseProvider } from '@GJK/providers/baseProvider'

export class Joker {
  provider:BaseProvider
  #system: TSystemMsg[]=[]

  constructor(opts:TJokerOpts) {
    const provider = getProvider(opts.provider)
    if(provider) this.provider = getProvider(opts.provider)

    opts?.system?.length && this.setSystem(opts.system)
  }
  
  setSystem = (msgs:Array<string|TSystemMsg>) => {
    this.#system = msgs.map(msg => {
      return isStr(msg) ? { role: EPromptRole.system, content: msg }
        : {role: EPromptRole.system, ...msg}
    })
  }

  ask = async (args:TJokerAsk|string) => {
    const question = buildQuestion(args, this.#system)
    return this.provider.prompt(question)
  }
}
