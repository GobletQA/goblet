import { ESectionType } from '@GBR/types'
import { capitalize, cls } from '@keg-hub/jsutils'
import {
  SectionHeaderText,
  SectionHeaderType,
  SectionHeaderContent
} from './Section.styled'

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
          ? (
              <>
                <SectionHeaderType
                  className={cls(
                    `section-header-text-type`,
                    type && `section-header-text-${type}`
                  )}
                >
                  {capType}:
                </SectionHeaderType>
                <SectionHeaderContent
                  className={cls(
                    `section-header-text-content`,
                    type && `section-header-text-${type}-content`
                  )}
                >
                  {content}
                </SectionHeaderContent>
              </>
            )
          : (
              <SectionHeaderType
                className={cls(
                  'section-header-text-type',
                  type && `section-header-text-${type}`
                )}
              >
                {capType}
              </SectionHeaderType>
            )
      }
      
    </SectionHeaderText>
  )
}
