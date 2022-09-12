import React from 'react'
import { RenderOutput } from './renderOutput'
import { useActiveTestRuns } from 'GBHooks/activeFile/useActiveTestRuns'
import { ReCmdRow, ReCmdMain, ReCmdSurface } from './cmd.restyle'

export const CmdOutput = props => {
  const { activeFile } = props
  const testRunModel = useActiveTestRuns()

  return (
    <ReCmdMain className={`cmd-grid`}>
      <ReCmdRow className='cmd-cmd-row'>
        <RenderOutput testRunModel={testRunModel} testFile={activeFile} />
      </ReCmdRow>
    </ReCmdMain>
  )
}
