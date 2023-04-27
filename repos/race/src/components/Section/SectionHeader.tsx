import { ESectionType, ESectionExt } from '@GBR/types'
import { capitalize, cls } from '@keg-hub/jsutils'
import {
  SectionHeaderText,
  SectionHeaderType,
  SectionHeaderContent
} from './SectionHeader.styled'

export type TSectionHeader = {
  content?:string
  typeHidden?:boolean
  type: ESectionType|ESectionExt
}

export const SectionHeader = (props:TSectionHeader) => {
  const {
    type,
    content,
    typeHidden,
  } = props

  const capType = capitalize(type)

  return (
    <SectionHeaderText>
      {
        content
          ? (
              <>
                {typeHidden !== true && (
                  <SectionHeaderType
                    className={cls(
                      `gb-section-header-chunk`,
                      `gb-section-header-type`,
                      type && `gb-section-header-type-${type}`
                    )}
                  >
                    {capType}:
                  </SectionHeaderType>
                )}
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
