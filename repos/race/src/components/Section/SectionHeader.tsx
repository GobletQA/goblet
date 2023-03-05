import { ESectionType } from '@GBR/types'
import { capitalize } from '@keg-hub/jsutils'
import { SectionHeaderText } from './Section.styled'

export type TStepHeader = {
  type: ESectionType
  content?:string
}

export const SectionHeader = (props:TStepHeader) => {
  const {
    type,
    content,
  } = props

  const capType = capitalize(type)

  return (
    <SectionHeaderText>
      {
        content
          ? (<span><b>{capType}:</b> {content}</span>)
          : (<b>{capType}</b>)
      }
      
    </SectionHeaderText>
  )
}