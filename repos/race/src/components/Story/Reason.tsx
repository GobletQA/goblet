import type { TMeta } from './Story'
import type { ChangeEvent } from 'react'
import type { TRaceFeature } from '@GBR/types'
import type { TAstBlock } from '@ltipton/parkin'


import { useMemo } from 'react'
import { capitalize, ensureArr, isArr } from '@keg-hub/jsutils'
import { MetaInputContainer } from './Story.styled'
import { ESectionType, EMetaType } from '@GBR/types'
import { stopEvent, useInline, Input } from '@gobletqa/components'
import { updateProperty } from '@GBR/actions/story/updateProperty'

export type TReason = TMeta & {
  type: ESectionType
}

const useMergeReason = (reason:TAstBlock|TAstBlock[]|undefined) => {
  // TODO: fix so new line is only added when length is greater then 1 line
  return useMemo(() => {
    return !reason
      ? ``
      : ensureArr(reason).reduce((acc, item) => {
          acc += `${item?.content}\n`

          return acc
        }, ``)
  }, [reason])
}


export const Reason = (props:TReason) => {
  const { parent } = props
  const { reason } = parent

  const onChange = useInline((
    evt:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?:string,
  ) => {
    stopEvent(evt)
    const val = value || evt.target.value
    // Fix to save the reason property as AST block for each line
    console.log(`------- val -------`)
    console.log(val)

    // updateProperty(`reason`, value || ``, parent)
  })

  const merged = useMergeReason(reason)



  return (
    <MetaInputContainer className='gr-feature-reason gr-meta-input-container' >

      <Input
        value={merged}
        labelSide={true}
        multiline={true}
        variant='standard'
        onChange={onChange}
        placeholder='So that ...'
        id={`${parent.uuid}-reason`}
        className='gr-feature-reason'
        label={capitalize(EMetaType.reason)}
      />

    </MetaInputContainer>
  )
}