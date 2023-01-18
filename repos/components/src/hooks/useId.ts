import { uuid, hashString } from '@keg-hub/jsutils'
import { useEffect, useRef, useMemo } from 'react'

const shortId = () => hashString(uuid())

export const useId = () => {
  const id = useMemo(() => shortId(), [])
  const idRef = useRef<string>(id)

  useEffect(() => {
    id !== idRef.current && (idRef.current = id)
  }, [id])

  return idRef.current
}