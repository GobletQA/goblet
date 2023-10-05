import {EJokerAction, EJokerMessageType, TJokerMessage} from "@types"


const messages:TJokerMessage[] = [
  {
    id: 2,
    text: `Hey, can you help me write a feature file?`,
    type: EJokerMessageType.User,
    actions: []
  },
  {
    id: 3,
    text: `Sure, do you have a user story already written?`,
    type: EJokerMessageType.Joker,
    actions: []
  },
  {
    id: 4,
    text: `Yah, here you go:\n\n\`\`\`\nAs a user\nI want to search google.com\nSo that I can find what I'm looking for\n\n\`\`\``,
    type: EJokerMessageType.User,
    actions: []
  },
  {
    id: 1,
    type: EJokerMessageType.Joker,
    text: (<>Ok, click the <b>Generate</b> button to confirm</>),
    actions: [
      {
        label: `Cancel`,
        variant: `text`,
        id: EJokerAction.CancelAction,
        kind: EJokerAction.CancelAction,
      },
      {
        label: `Generate?`,
        id: EJokerAction.GenerateFeature,
        kind: EJokerAction.GenerateFeature,
      }
    ]
  },
  {
    id: 5,
    text: `Generating feature...`,
    type: EJokerMessageType.Joker,
    actions: []
  }
]

export const jokerMessages = [
  {
    "id": "dc3d01dd-df3c-4945-950c-5bbad7598778",
    "message": "",
    "error": false,
    "data": {
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
    },
    "group": "all",
    "name": "general",
    "isRunning": false,
    "groupId": "goblet",
    "timestamp": 1696372162975,
    "socketId": "c2WaYqW3yiQtMOPAAAAN",
  },
  {
    "id": "ac3db14d-d33d-4945-950c-7beae7598779",
    "message": "",
    "error": false,
    "data": {
      "requestId": "a440d.3eff01",
      "id": "chatcmpl-xspRQhucbWqfoThcMBZjm9",
      "object": "chat.completion",
      "created": 1696367976,
      "model": "gpt-3.5-turbo",
      "choices": [
        {
          "index": 0,
          "message": {
            "role": "assistant",
            "content": "I'm not sure I understand what you are saying. Could you explain?"
          },
          "finish_reason": "stop"
        }
      ],
      "usage": {
        "prompt_tokens": 24,
        "total_tokens": 41,
        "completion_tokens": 17
      },
    },
    "group": "all",
    "name": "general",
    "isRunning": false,
    "groupId": "goblet",
    "timestamp": 1696367977000,
    "socketId": "L6oqaLL1MPmMMWnhAACp",
  }
]