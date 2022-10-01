import type { TFeatureFileModel } from '@types'
import Box from '@mui/material/Box'
import { useSelector } from '@store'
import { Features } from './Features'
import { FormGen, TFConfig } from '@components/Form/FormGen'

export type TBuilder = {
  
}


const buildConfig:TFConfig = {
  name: `Feature Builder`,
  rows: [
    {
      id: `feature-meta`,
      items: [
        {
          type: `text`,
          required: true,
          fullWidth: true,
          label: `Feature Name`,
          key: `feature-name-input`,
          placeholder: `Enter a Feature Name`,
          rules: {},
        },
        {
          type: `text`,
          required: true,
          multiline: true,
          fullWidth: true,
          key: `feature-meta-input`,
          label: `Feature metadata`,
          placeholder: `Reason or purpose of the feature`,
          rules: {},
        }
      ]
    },
    {
      id: `scenarios`,
      items: [
        {
          required: true,
          width: `half`,
          key: `scenario-name-input`,
          label: `Scenario Name`,
          type: `select`,
          placeholder: `Enter a Scenario Name`,
          rules: {},
        }
      ]
    }
  ]
}

export const Builder = (props:TBuilder) => {

  const features = useSelector(state => {
    return state.files.files.filter(file => file.fileType === 'gherkin')
  }) as TFeatureFileModel[]


  return (
    <Box
      sx={{
        margin: `20px`
      }}
    >
      <FormGen
        config={buildConfig}
      />
    </Box>
  )
}