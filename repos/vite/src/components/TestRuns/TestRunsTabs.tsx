import { ETestRunsSection } from '@types'
import { cls, wordCaps } from '@keg-hub/jsutils'

import {
  TestRunsSection,
  TestRunsSectionBtn,
  TestRunsSectionsContainer,
} from './TestRuns.styled'


export type TTestRunsTabs = {
  section:ETestRunsSection
  onChangeSection: (section:ETestRunsSection) => void
}

export const TestRunsTabs = (props:TTestRunsTabs) => {
  const {
    section,
    onChangeSection
  } = props
  
  return (
    <TestRunsSectionsContainer className='gb-test-sections-container' >
      <TestRunsSection className='gb-test-section gb-test-section-config' >
        <TestRunsSectionBtn
          className={cls(
            `gb-test-section-button`,
            section === ETestRunsSection.config && `active`,
          )}
          text={wordCaps(ETestRunsSection.config)}
          onClick={() => onChangeSection(ETestRunsSection.config)}
        />
      </TestRunsSection>

      <TestRunsSection className='gb-test-section gb-test-section-reporter' >
        <TestRunsSectionBtn
          className={cls(
            `gb-test-section-button`,
            section === ETestRunsSection.reporter && `active`,
          )}
          text={wordCaps(ETestRunsSection.reporter)}
          onClick={() => onChangeSection(ETestRunsSection.reporter)}
        />
      </TestRunsSection>

      <TestRunsSection className='gb-test-section gb-test-section-runs' >
        <TestRunsSectionBtn
          className={cls(
            `gb-test-section-button`,
            section === ETestRunsSection.runs && `active`,
          )}
          text={`Previous ${wordCaps(ETestRunsSection.runs)}`}
          onClick={() => onChangeSection(ETestRunsSection.runs)}
        />
      </TestRunsSection>

    </TestRunsSectionsContainer>
  )
}