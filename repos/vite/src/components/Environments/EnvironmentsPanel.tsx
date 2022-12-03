import type { TSidebarPanel } from '@gobletqa/monaco'
import Box from '@mui/material/Box'
import { Button } from '@components/Buttons/Button'

export type TEnvironmentsContent = {
  
}

export const EnvironmentsContent = (props:TEnvironmentsContent) => {
  return (
    <Box
      sx={{
        marginTop: `10px`,
        display: `flex`,
        alignContent: `center`,
        justifyContent: `center`,
      }}
    >
      <Button>
        Add Environment
      </Button>
    </Box>
  )
}

export const EnvironmentsPanel:TSidebarPanel = {
  actions:[],
  header:true,
  title: `Environments`,
  children:(<EnvironmentsContent />),
  className:`goblet-monaco-env-panel`
}
