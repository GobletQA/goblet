
export enum EAIModel {
  Llama27=`Llama-2-7b`,
  Llama270=`Llama-2-70b`,
  CodeLlama34=`codellama-34b`,
  CodeLlama34Inst=`CodeLlama-34b-Instruct-hf`,
  PCodeLlama34=`Phind-CodeLlama-34B-v2`,
  GPT4=`gpt-4`,
  GPT403=`gpt-4-0314`,
  GPT406=`gpt-4-0613`,
  GPT432k=`gpt-4-32k`,
  GPT432k03=`gpt-4-32k-0314`,
  GPT432k06=`gpt-4-32k-0613`,
  GPT3T=`gpt-3.5-turbo`,
  GPT3T16k=`gpt-3.5-turbo-16k`,
  GPT3T03=`gpt-3.5-turbo-0301`,
  GPT3T06=`gpt-3.5-turbo-0613`,
  GPT3T16k06=`gpt-3.5-turbo-16k-0613`,
}

export type TLlamaAIModel = EAIModel.Llama27 | EAIModel.Llama270
export type TCodeLlamaAIModel = EAIModel.CodeLlama34 | EAIModel.PCodeLlama34
export type TOpenAIModel = EAIModel.GPT4
  | EAIModel.GPT403
  | EAIModel.GPT406
  | EAIModel.GPT432k
  | EAIModel.GPT432k03
  | EAIModel.GPT432k06
  | EAIModel.GPT3T
  | EAIModel.GPT3T16k
  | EAIModel.GPT3T03
  | EAIModel.GPT3T06
  | EAIModel.GPT3T16k06

