import {toNum} from "@keg-hub/jsutils/toNum"
import {exists} from "@keg-hub/jsutils/exists"

export type TFormatWorldFile = {
  world:Record<string, any>,
  autoFormat?:boolean,
  indentation?:string|number
}

export const formatWorldFile = ({
  world,
  autoFormat,
  indentation
}:TFormatWorldFile) => {
  let content:string
  try {
    content = autoFormat && exists(indentation)
      ? JSON.stringify(world, null, toNum(indentation))
      : JSON.stringify(world, null, 2)

    return { content, error: undefined }
  }
  catch(error){
    return {
      content: undefined,
      error:error as Error,
    }
  }
  
}