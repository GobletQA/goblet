import type { TProviderOpts } from '@GJK/types'
import { SemanticSearch, Chatbot, ChatGPTInput } from 'intellinode'


import { ENVS } from '@gobletqa/environment'
import { BaseProvider } from './baseProvider'

export class IntelliNode extends BaseProvider {
  ai:Chatbot
  search:SemanticSearch

  constructor(opts:TProviderOpts){
    super(opts)
    const apiKey = opts?.auth?.apiKey || ENVS.GB_OPEN_AI_KEY
    const organization = opts?.auth?.organization || ENVS.GB_OPEN_AI_ORG_ID

    this.ai = new Chatbot(apiKey)
    this.search = new SemanticSearch(apiKey)
  }

  findIn = async (query?:string, items?:string[], numberOfMatches?:number) => {
    const results = await this.search.getTopMatches(query, items, numberOfMatches)
    const filteredArray = this.search.filterTopMatches(results, items)
    
  }

}
