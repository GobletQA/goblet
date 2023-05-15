import type { TDefinitionsState } from '@types'
import type { TStepDefsList } from '@ltipton/parkin'

import { emptyArr } from '@keg-hub/jsutils'

import { useMemo } from 'react'

export const useRaceSteps = (defs:TDefinitionsState) => {

  return useMemo(() => {
    return Object.entries(defs.definitions)
      .reduce((steps, [key, fileModel]) => {
        fileModel?.ast?.definitions?.length
          && fileModel?.ast?.definitions.forEach(defAst => {
            steps[defAst.uuid] = defAst

            // TODO: Map the expression to the meta-data
            // Would be better to do in parkin
            // But this can be migrated to that
            // Right now meta data is not required
            // But we could make it a first-class citizen in parkin

            // const exps = [...(defAst?.meta?.expressions || emptyArr)]
            
            // ;(defAst.match as string).split(` `).map((word:string) => {

            //   const matched = word.match(/\s*{(.*?)}\s*/)
            //   if(!matched) return
              
            //   const [full, content] = matched

            //   const exp = exps.shift()
            //   if(exp.type !== content)
            //     console.log(
            //       `Step expression does not match existing meta data expression`,
            //       content,
            //       exp
            //     )

            // })

          })

        return steps
      }, {} as TStepDefsList)
  }, [defs.definitions])
}