import {useSettings} from '@hooks/settings/useSettings'

const worldSettings = [
  `worldAutoFormat`,
  `worldIndentation`
]

export const useWorldSettings = () => {
  const {
    worldAutoFormat:autoFormat,
    worldIndentation:indentation
  } = useSettings(worldSettings, `goblet`)

  return {
    autoFormat,
    indentation
  }
}