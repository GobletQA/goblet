import {useTestRunStats} from '@hooks/testRuns/useTestRunStats'
import type { TTestRun } from '@types'

import {
  TestRunOverviewText,
  TestRunOverviewSection,
  TestRunOverviewSections,
  TestRunOverviewContainer,
  TestRunOverviewSectionTitle
} from './TestRunOverview.styled'

import {
  TestRunSectionHeader,
  TestRunSectionHeaderTitle,
} from './TestRunsReporter.styled'


export type TTestRunOverview = {
  run:TTestRun
}

export type TTROSection = {
  title:string
  failed:number
  passed:number
  skipped:number
}

const TROSection = (props:TTROSection) => {
  const {
    title,
    failed,
    passed,
    skipped,
  } = props

  return (
    <TestRunOverviewSection className='gb-overview-section' >
      <TestRunOverviewSectionTitle className="gb-overview-section-header" >
        {title}
      </TestRunOverviewSectionTitle>
      <TestRunOverviewText className="gb-overview-text failed" >
        {failed} failed
      </TestRunOverviewText>
      <TestRunOverviewText className="gb-overview-text passed" >
        {passed} passed
      </TestRunOverviewText>
      <TestRunOverviewText className="gb-overview-text skipped" >
        {skipped} skipped
      </TestRunOverviewText>
    </TestRunOverviewSection>
  )

}

export const TestRunOverview = (props:TTestRunOverview) => {
  const stats = useTestRunStats(props)

  return stats && (
    <TestRunOverviewContainer className="gb-overview-container" >
      <TestRunSectionHeader>
        <TestRunSectionHeaderTitle>
          Overview
        </TestRunSectionHeaderTitle>
      </TestRunSectionHeader>
    
      <TestRunOverviewSections className="gb-overview-sections" >
        <TROSection
          title='Features'
          failed={stats.failed.features}
          passed={stats.passed.features}
          skipped={stats.skipped.features}
        />
        <TROSection
          title='Parents'
          failed={stats.failed.parents}
          passed={stats.passed.parents}
          skipped={stats.skipped.parents}
        />
        <TROSection
          title='Steps'
          failed={stats.failed.steps}
          passed={stats.passed.steps}
          skipped={stats.skipped.steps}
        />
      </TestRunOverviewSections>
    </TestRunOverviewContainer>
  ) || null
  
}