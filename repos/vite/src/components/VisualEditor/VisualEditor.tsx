import { RaceEditor } from '@gobletqa/race' 
import { BlockIcon } from '@components/Icons'
import { NotConnected } from '@components/NotConnected'
import { useRaceHooks } from '@hooks/race/useRaceHooks'

export type TVisualEditor = {
  
}

export const VisualEditor = (props:TVisualEditor) => {

  const {
    steps,
    models,
    connected
  } = useRaceHooks()

  return connected
    ? (
        <RaceEditor
          steps={steps}
          models={models}
        />
      )
    : (
        <NotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
}