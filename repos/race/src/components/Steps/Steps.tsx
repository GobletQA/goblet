import type { TStepParentAst } from '@GBR/types'

import { Step } from './Step'
import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { EmptySteps } from './EmptySteps'
import { Section } from '../Section'

export type TSteps = {
  parent:TStepParentAst
}

export const Steps = (props:TSteps) => {
  const {
    parent
  } = props

  return (
    <>
      <Section
        stack={0}
        gutter={true}
        header={true}
        variant={`h5`}
        title={`Steps`}
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
      </Section>
      <AddItem
        parentId={parent?.uuid}
        type={ESectionType.step}
      />
    </>
  )
}