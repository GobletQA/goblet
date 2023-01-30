import type { TStepParentAst } from '@GBR/types'

import { Step } from './Step'
import { Stack } from '../Shared'
import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { EmptySteps } from './EmptySteps'

export type TSteps = {
  parent:TStepParentAst
}

export const Steps = (props:TSteps) => {
  const {
    parent
  } = props

  return (
    <>
      <Stack
        stack={0}
        gutter={true}
        type={ESectionType.steps}
        className='gr-steps-section'
      >
        {
          !parent?.steps?.length
            ? (<EmptySteps parent={parent} />)
            : parent?.steps?.map((step) => {
                return (
                  <Step
                    step={step}
                    parent={parent}
                    key={`${parent.uuid}-${step.index}-${step.uuid}`}
                  />
                )
              })
        }
      </Stack>
      <AddItem
        parentId={parent?.uuid}
        type={ESectionType.step}
      />
    </>
  )
}