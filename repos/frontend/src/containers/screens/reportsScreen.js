import React from 'react'
import { Values } from 'GBConstants'
import { EmptyScreen } from './index'
import { Reports } from 'GBComponents/reports'
import { RsScreenMain } from './screens.restyle'
import { useActiveFile } from 'GBHooks/activeFile/useActiveFile'
import { AsideCmdOutput } from 'GBComponents/cmdOutput/asideCmdOutput'

const { SCREENS } = Values

/**
 * ReportsScreen Component - Shows test reports and testRun model outputs
 * @param {Object} props
 *
 */
const ReportsScreen = props => {
  const activeFile = useActiveFile(SCREENS.REPORTS)

  return !activeFile?.fileType ? (
    <EmptyScreen message={'No file selected!'} />
  ) : (
    <RsScreenMain className={`reports-screen`}>
      <Reports {...props} />
      <AsideCmdOutput activeFile={activeFile} />
    </RsScreenMain>
  )
}

export default ReportsScreen