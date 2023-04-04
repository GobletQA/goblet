import { ESectionType } from '@GBR/types'
import { capitalize, cls } from '@keg-hub/jsutils'
import {
  SectionHeaderText,
  SectionHeaderType,
  SectionHeaderContent
} from './SectionHeader.styled'

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
                    `gb-section-header-chunk`,
                    `gb-section-header-type`,
                    type && `gb-section-header-type-${type}`
                  )}
                >
                  {capType}:
                </SectionHeaderType>
                <SectionHeaderContent
                  className={cls(
                    `gb-section-header-chunk`,
                    `gb-section-header-part`,
                    type && `gb-section-header-part-${type}`
                  )}
                >
                  {content}
                </SectionHeaderContent>
              </>
            )
          : (
              <SectionHeaderType
                className={cls(
                  `gb-section-header-chunk`,
                  `gb-section-header-type`,
                  type && `gb-section-header-type-${type}`
                )}
              >
                {capType}
              </SectionHeaderType>
            )
      }
      
    </SectionHeaderText>
  )
}
