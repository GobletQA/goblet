import type { TMenuItem } from '@gobletqa/components'

import { ExamRunAlert } from '@components/Alerts/ExamRunAlert'
import { AnimationPlayOutlineIcon } from '@gobletqa/components'

export const ExamRunAction:TMenuItem = {
  closeMenu:true,
  Icon: AnimationPlayOutlineIcon,
  text: `Run Full Test Suite`,
  id:`run-test-suite-editor-action`,
  key:`run-test-suite-editor-action`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `Run all features files included in the test suite`,
  },
  onClick: ExamRunAlert,
}
