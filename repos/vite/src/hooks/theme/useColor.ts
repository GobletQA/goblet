
import { useMemo } from 'react'
import { useTheme } from './useTheme'
import { getThemeColor } from '@utils/components/getThemeColor'



export const useColor = (light:string, dark:string) => {
  const theme = useTheme()
  
  return useMemo(() => {
    
  }, [light, dark])
  
}