import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { RootContainer } from '@containers/root'


const App = () => {
  return (
    <RootContainer>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          This IS VITE!!!
        </Typography>
      </Box>
    </RootContainer>
  )
}

export default App