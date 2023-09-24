import { colors, PlayCircleOutlineIcon } from '@gobletqa/components'
import {useTestRuns} from '@store'
import {
  NoPastRunsIcon,
  NoPastRunsText,
  NoPastRunsButton,
  NoPastRunsContainer,
  PastTestRunsContainer,
  NoPastRunsTextContainer,
  NoPastRunsButtonContainer
} from './PastTestRuns.styled'
import { ETestRunsSection } from '@types'

export type TPastTestRuns = {
  onChangeSection:(section:ETestRunsSection) => void
}



export const PastTestRuns = (props:TPastTestRuns) => {
  const { onChangeSection } = props
  const { runs } = useTestRuns()

  return (
    <PastTestRunsContainer>
    
      {!runs?.length && (
        <NoPastRunsContainer>

          <NoPastRunsTextContainer>
            <NoPastRunsIcon />
            <NoPastRunsText>
              No previous test runs exist
            </NoPastRunsText>
          </NoPastRunsTextContainer>

          <NoPastRunsButtonContainer>
            <NoPastRunsButton
              text='Run Tests'
              variant='contained'
              Icon={PlayCircleOutlineIcon}
              onClick={() => onChangeSection(ETestRunsSection.runOptions)}
            />
          </NoPastRunsButtonContainer>

        </NoPastRunsContainer>
      )}
    


    </PastTestRunsContainer>
  )
}