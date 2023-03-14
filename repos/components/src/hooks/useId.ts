import { useEffect, useRef, useMemo } from 'react'
import { shortId } from '@GBC/utils/components/shortId'

export const useId = (initId?:string) => {
  const id = useMemo(() => shortId(), [])
  const idRef = useRef<string>(id)

  useEffect(() => {
    id !== idRef.current && (idRef.current = id)
  }, [id])

  return idRef.current
}