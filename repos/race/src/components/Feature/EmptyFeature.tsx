import type { CSSProperties } from 'react'
import type { TRaceFeature } from '@GBR/types'
import type { TFeatureItem } from './FeatureItems'

import { AddItem } from '../AddItem'
import { useSettings } from '@GBR/contexts'
import { isArr, exists } from '@keg-hub/jsutils'
import { ESectionExt, ESectionType } from '@GBR/types'
import { Tooltip, gutter, Text, If } from '@gobletqa/components'

import {
  EmptyList,
  EmptyItem,
  EmptyFeatureGrid,
  EmptyItemTextContainer,
} from './Feature.styled'

export type TEmptyFeature = {
  sx?:CSSProperties
  parent:TRaceFeature
  items:TFeatureItem[]
}

const styles:Record<string, CSSProperties> = {
  container: {
    paddingTop: `0px`,
    padding: gutter.padding.px,
  },
  item: {
    marginBottom: gutter.margin.px,
  },
  add: {
    width: `100%`,
    minWidth: `205px`,
    marginBottom: gutter.margin.hpx,
    borderBottom: `1px solid var(--goblet-list-focusBackground)`,
  }
}

export const EmptyFeature = (props:TEmptyFeature) => {
  const { items, parent, sx } = props
  const { settings } = useSettings()

  return (
    <EmptyFeatureGrid
      container
      spacing={2}
      sx={[styles.container, sx] as CSSProperties[]}
    >
      <EmptyList>

        {items.map(({ description, ...item}) => {
          const section = parent[item.featureKey as keyof TRaceFeature]
          const generalActive = item.featureKey === ESectionExt.general && settings?.displayMeta

          return generalActive || exists(section) && (!isArr(section) || section.length)
            ? null
            : (
                  <EmptyItem
                    sx={styles.item}
                    key={item.type||item.text}
                    className={`feature-${item.type}-empty-item`}
                  >
                    <Tooltip
                      describeChild
                      title={`Add ${item.type || item.text} section to the current Feature`}
                    >
                      <AddItem
                        {...item}
                        variant='text'
                        sx={styles.add}
                        parentId={parent.uuid}
                        type={ESectionType.background}
                      />
                     </Tooltip>

                    <EmptyItemTextContainer
                      className={`feature-${item.type}-empty-text`}
                    >
                      <If check={description}>
                        <Text>
                          {description}
                        </Text>
                      </If>
                    </EmptyItemTextContainer>

                  </EmptyItem>
              )
          
        })}
      </EmptyList>
    </EmptyFeatureGrid>
  )
  
}