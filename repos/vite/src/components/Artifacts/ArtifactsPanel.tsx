import type { TSidebarPanel } from '@gobletqa/monaco'
import Box from '@mui/material/Box'


export type TArtifactsContent = {
  
}

export const ArtifactsContent = (props:TArtifactsContent) => {
  return (
    <Box
      sx={{
        marginTop: `10px`,
        marginBottom: `10px`,
        display: `flex`,
        alignContent: `center`,
        justifyContent: `center`,
      }}
    >
      N/A
    </Box>
  )
}

export const ArtifactsPanel:TSidebarPanel = {
  actions:[],
  header:true,
  title: `Artifacts`,
  children:(<ArtifactsContent />),
  className:`goblet-monaco-env-panel`
}
