import type { TRaceFeature, TFeaturesRef, TEditingProps } from '@GBR/types'

import { Meta } from '../Meta'
import { Section } from '../Section'
import { ESectionType } from '@GBR/types'
import { Dropdown } from '@gobletqa/components'

export type TFeatureMeta = TEditingProps & {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
}

export const FeatureMeta = (props:TFeatureMeta) => {
  const { parent, featuresRef, editing, setEditing } = props

  return (
    <Dropdown
      id={parent.uuid}
      headerText={`Meta Data`}
    >
      <Section
        stack={2}
        editing={editing}
        setEditing={setEditing}
        type={ESectionType.feature}
      >
        <Meta
          parent={parent}
          editing={editing}
          setEditing={setEditing}
          featuresRef={featuresRef}
          type={ESectionType.feature}
        />
      </Section>
    </Dropdown>
  )
  
}