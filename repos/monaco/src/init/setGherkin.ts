import type { TMonaco, TEditorConfig } from '@GBM/types'

import { noPropArr } from '@keg-hub/jsutils'

export const setGherkin = async (config:TEditorConfig, monaco:TMonaco) => {
  if(!config.gherkin) return

  const { addGherkinToMonaco } = await import('../utils/gherkin/addGherkinToMonaco')
  const { definitions } = config.gherkin

  const findStepDefMatch = (matchText:string) => {
    return definitions.filter(def => (
      def.suggestion
        .toLowerCase()
        .includes(matchText.toLowerCase())
    ))
  }

  addGherkinToMonaco(monaco, findStepDefMatch, noPropArr)

}