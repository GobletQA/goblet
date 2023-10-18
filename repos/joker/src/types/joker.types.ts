import type { TProviderOpts } from './provider.types'
import type {
  TQMsg,
  TQuestion,
  TPromptMsg,
  TSystemMsg,
} from './prompt.types'


export type TJokerOpts = {
  provider:TProviderOpts
  system?:TSystemMsg[]
}

export type TJokerAsk = Omit<TQuestion, `messages`> & {
  q?:TPromptMsg|string
  qs?:TQMsg[]
  question?:TPromptMsg|string
  questions?:TQMsg[]
}