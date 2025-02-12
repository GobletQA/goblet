import type { TMenuItem } from '@gobletqa/components'

import { toggleTestRunsView } from '@actions/testRuns/toggleTestRunsView'
import { FolderPlayOutlineIcon } from '@gobletqa/components'

export const TestRunsAction:TMenuItem = {
  closeMenu:true,
  Icon: FolderPlayOutlineIcon,
  text: `Run Test Suite`,
  id:`run-test-suite-editor-action`,
  key:`run-test-suite-editor-action`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `Run all features files included in the test suite`,
  },
  onClick: () => toggleTestRunsView(),
}
