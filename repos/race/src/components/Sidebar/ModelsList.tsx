import type { TRaceModel, TModelsRef } from '@GBR/types'

import Box from '@mui/material/Box'
import { useCallback } from 'react'
import { useModel } from '../../contexts'
import { ListModels, ModelsItem } from './ModelsList.styled'

export type TModelsList = {
  modelsRef:TModelsRef
}

type TListItem = {
  model:TRaceModel
}

const ListItem = (props:TListItem) => {
  const { model:active, setModel } = useModel()

  const { model } = props

  const onClick = useCallback(() => setModel(model), [model, setModel])

  return (
    <ModelsItem
      onClick={onClick}
    >
      <Box>
        {model.feature}
      </Box>
    </ModelsItem>
  )
}

export const ModelsList = (props:TModelsList) => {
  const {
    modelsRef
  } = props

  return (
    <ListModels
      className='goblet-race-models-list'
      subheader={<li />}
    >
      {Object.entries(modelsRef.current).map(([key, model]) => {
        return (
          <ListItem
            model={model}
            key={`${key}-${model.uuid}`}
          />
        )
      })}
    </ListModels>
  )

}