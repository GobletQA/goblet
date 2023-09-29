import type { TTestRunEvent } from "@types"
import { TestRunFileRootEvtRef } from "@constants"

import { ETREvtType } from "@types"

export const getTREventType = (event:TTestRunEvent) => {

  if(event.uuid === TestRunFileRootEvtRef) return ETREvtType.file

  else if(event.metaType === `feature`) return ETREvtType.feature

  else if(event.type === `describe`) return ETREvtType.parent

  return ETREvtType.step
}