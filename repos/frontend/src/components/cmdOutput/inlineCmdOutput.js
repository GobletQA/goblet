import React from 'react'
import { RenderOutput } from './renderOutput'
import { useActiveTestRuns } from 'GBHooks/activeFile/useActiveTestRuns'
import { ReInlineCmdRow, ReInlineCmdMain } from './cmd.restyle'

export const InlineCmdOutput = props => {
  const { activeFile } = props
  const testRunModel = useActiveTestRuns()

  return (
    <ReInlineCmdMain className={`inline-cmd-grid`}>
      <ReInlineCmdRow className='inline-cmd-row'>
        <RenderOutput testRunModel={testRunModel} testFile={activeFile} />
      </ReInlineCmdRow>
    </ReInlineCmdMain>
  )
}
