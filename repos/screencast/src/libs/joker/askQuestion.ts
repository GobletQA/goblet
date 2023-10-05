import type { TJokerReq, TJokerRes } from '@gobletqa/joker'

import { Logger } from '@GSC/utils/logger'
import { isStr } from '@keg-hub/jsutils/isStr'
import { limbo } from '@keg-hub/jsutils/limbo'
import { nanoid } from '@keg-hub/jsutils/nanoid'
import { jokerAI } from '@gobletqa/joker/jokerAI'

export const jokerMessage = {
  "requestId": "d1c30.f7696e",
  "id": "chatcmpl-3bptdSLezXmkQkdLqfQMzH",
  "object": "chat.completion",
  "created": 1696372162,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "My name is LLaMA, I'm a large language model trained by a team of researcher at Meta AI. My primary function is to generate human-like text responses to user input, whether it be a question, statement, or prompt. I can be used to create chatbots, virtual assistants, or any other application that requires natural language understanding and generation capabilities."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 16,
    "total_tokens": 96,
    "completion_tokens": 80
  },
}

const mockQResp = () => {
  return new Promise((res) => {
    setTimeout(() => {
      res(jokerMessage)
    }, 1000)
  })
}

export const askQuestion = async (props:TJokerReq) => {

  // return await mockQResp()

  const {
    id,
    text,
  } = props

  if(!isStr(text)){
    Logger.log(`Can not ask Joker, a question is required!`, props)
    return {
      error: true,
      data: { id: nanoid(), requestId: id } as TJokerRes,
      message: `Can not ask Joker, a question is required!`
    }
  }

  const [err, resp] = await limbo<TJokerRes>(jokerAI.ask({ question: text, id }))

  if(err){
    err && Logger.log(err.stack)
    return {
      error: true,
      message: err.message,
      data: { id: nanoid(), requestId: id, ...resp } as TJokerRes,
    }
  }
  
  return resp

}