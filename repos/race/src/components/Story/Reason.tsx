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
  return useMemo(() => {
    if(!reason) return ``
    const reasonArr = ensureArr<TAstBlock>(reason)
    
    return reasonArr.length <= 1
      ? reasonArr[0]?.content
      : ensureArr(reason).reduce((acc, item) => {
          acc += `${item?.content}\n`
          return acc
        }, ``)

  }, [reason])
}


export const Reason = (props:TReason) => {
  const { parent } = props
  const { reason } = parent

  const onBlur = useInline((
    evt:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>,
    value?:string,
  ) => {
    stopEvent(evt)
    const val = value || evt.target.value || ``
    const lines = val.split(`\n`)
    updateProperty(`reason`, lines || ``, parent)
  })

  const merged = useMergeReason(reason)

  return (
    <MetaInputContainer className='gr-feature-reason gr-meta-input-container' >

      <Input
        value={merged}
        onBlur={onBlur}
        labelSide={true}
        multiline={true}
        variant='standard'
        placeholder='So that ...'
        id={`${parent.uuid}-reason`}
        className='gr-feature-reason'
        label={capitalize(EMetaType.reason)}
      />

    </MetaInputContainer>
  )
}