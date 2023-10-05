import type { Express } from 'express'
import type { TJokerRes, TJokerReq } from '@gobletqa/joker'
import type { TSocketEvtCBProps } from '@GSC/types'

import { Logger } from '@GSC/utils/logger'
import { JokerResponse } from '@gobletqa/joker'
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

export const jokerRequest = (app:Express) => async ({
  data,
  user,
  socket,
  Manager,
}:TSocketEvtCBProps<TJokerReq>) => {

  const {
    id,
    text,
    repo,
  } = data

  // setTimeout(() => {
  //   Manager.emit(socket, JokerResponse, { data: jokerMessage })
  // }, 2000)


  if(!isStr(text)){
    Logger.log(`Can not ask Joker, a question is required!`, data)

    return Manager.emit(socket, JokerResponse, {
      error: true,
      data: { id: nanoid(), requestId: id },
      message: `Can not ask Joker, a question is required!`
    })
  }

  const [err, resp] = await limbo<TJokerRes>(jokerAI.ask({ question: text, id }))

  if(err){
    err && Logger.log(err.stack)
    Manager.emit(socket, JokerResponse, {
      error: true,
      message: err.message,
      data: { id: nanoid(), requestId: id, ...resp },
    })
  }

  Manager.emit(socket, JokerResponse, { data: resp })
}
