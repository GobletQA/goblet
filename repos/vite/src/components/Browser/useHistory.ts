import { useProcesses } from './useProcesses'
import { useEffect, useState } from "react"

export type THistory = {
  position: number
  history: string[]
  currentUrl: string
  canGoBack: boolean
  canGoForward: boolean
  moveHistory: (step: number) => void
}

const useHistory = (url: string, id: string): THistory => {
  const { url: changeUrl } = useProcesses()
  const [currentUrl, setCurrentUrl] = useState(url)
  const [history, setHistory] = useState<string[]>(() => [url])
  const [position, setPosition] = useState<number>(0)

  const moveHistory = (step: number): void => {
    const newPosition = position + step

    setPosition(newPosition)
    setCurrentUrl(history[newPosition])
    changeUrl(history[newPosition])
  }

  useEffect(() => {
    if (url !== currentUrl) {
      setPosition(position + 1)
      setCurrentUrl(url)
      setHistory([...history.slice(0, position + 1), url])
    }
  }, [currentUrl, history, position, url])

  return {
    history,
    position,
    currentUrl,
    moveHistory,
    canGoBack: position > 0,
    canGoForward: position < history.length - 1,
  }
}

export default useHistory
