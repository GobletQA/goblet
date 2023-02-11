import type { CSSProperties } from 'react'
import type { TRaceFeature } from '@GBR/types'


import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { FeatureItems } from './FeatureItems'
import { isArr, exists } from '@keg-hub/jsutils'
import { Tooltip, gutter, colors, Text, If } from '@gobletqa/components'


import {
  EmptyList,
  EmptyItem,
  EmptyFeatureGrid,
  EmptyItemTextContainer,
} from './Feature.styled'

export type TEmptyFeature = {
  sx?:CSSProperties
  parent:TRaceFeature
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
  const { parent, sx } = props

  return (
    <EmptyFeatureGrid
      container
      spacing={2}
      sx={[styles.container, sx] as CSSProperties[]}
    >
      <EmptyList>

        {FeatureItems.map(({ description, ...item}) => {
          const section = parent[item.featureKey]

          return exists(section) && (!isArr(section) || section.length)
            ? null
            : (
                <Tooltip
                  describeChild
                  key={item.type||item.text} title={`Add ${item.type || item.text}`}
                >
                  <EmptyItem sx={styles.item} >

                    <AddItem
                      {...item}
                      variant='text'
                      sx={styles.add}
                      parentId={parent.uuid}
                      type={ESectionType.background}
                    />

                    <EmptyItemTextContainer>
                      <If check={description}>
                        <Text>
                          {description}
                        </Text>
                      </If>
                    </EmptyItemTextContainer>

                  </EmptyItem>
                </Tooltip>
              )
          
        })}
      </EmptyList>
    </EmptyFeatureGrid>
  )
  
}