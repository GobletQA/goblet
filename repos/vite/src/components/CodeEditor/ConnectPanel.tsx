import type { TSidebarPanel } from '@gobletqa/monaco'
import Box from '@mui/material/Box'
import { Button } from '@components/Buttons/Button'

export type TConnectContent = {
  
}

export const ConnectContent = (props:TConnectContent) => {
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
        Connect Repository
      </Button>
    </Box>
  )
}

export const ConnectPanel:TSidebarPanel = {
  actions:[],
  header:true,
  title: `Repository`,
  children:(<ConnectContent />),
  className:`goblet-monaco-connect-panel`
}
