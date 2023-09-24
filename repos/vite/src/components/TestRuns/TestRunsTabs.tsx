import type { ComponentType } from 'react'
import { ETestRunsSection } from '@types'
import { cls, snakeCase, wordCaps } from '@keg-hub/jsutils'

import {
  TestRunsSection,
  TestRunsListIcon,
  TestRunsOptsIcon,
  TestRunsSectionBtn,
  TestRunsReporterIcon,
  TestRunsSectionsContainer,
} from './TestRuns.styled'


export type TTestRunsTabs = {
  section:ETestRunsSection
  onChangeSection: (section:ETestRunsSection) => void
}

export type TTestRunTab = {
  active?:boolean
  Icon?:ComponentType<any>
  className?:string
  buttonClass?:string
  section:ETestRunsSection
  onClick?:(section:ETestRunsSection) => void
}



export const TestRunsTab = (props:TTestRunTab) => {
  
  const {
    Icon,
    active,
    onClick,
    section,
    className,
    buttonClass,
  } = props
  
  return (
    <TestRunsSection className={cls(
      className,
      `gb-test-section`,
      `gb-test-section-${section}`,
    )} >
      <TestRunsSectionBtn
        Icon={Icon}
        onClick={() => onClick?.(section)}
        text={`${wordCaps(snakeCase(section))}`}
        className={cls(
          buttonClass,
          active && `active`,
          `gb-test-section-button`,
        )}
      />
    </TestRunsSection>
  )
}

export const TestRunsTabs = (props:TTestRunsTabs) => {
  const {
    section,
    onChangeSection
  } = props
  
  return (
    <TestRunsSectionsContainer className='gb-test-sections-container' >
      <TestRunsTab
        onClick={onChangeSection}
        Icon={TestRunsListIcon}
        section={ETestRunsSection.testRuns}
        active={section === ETestRunsSection.testRuns}
      />
      <TestRunsTab
        onClick={onChangeSection}
        Icon={TestRunsReporterIcon}
        section={ETestRunsSection.reporter}
        active={section === ETestRunsSection.reporter}
      />
      <TestRunsTab
        Icon={TestRunsOptsIcon}
        onClick={onChangeSection}
        section={ETestRunsSection.runOptions}
        active={section === ETestRunsSection.runOptions}
      />
    </TestRunsSectionsContainer>
  )
}