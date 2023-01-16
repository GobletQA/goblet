import { useMemo } from 'react'

export type THRefText = {
  id?: string
  name:string
}

export const useRefText = ({ id, name }:THRefText) => {
  return useMemo(() => {
    return (id || name).replace(` `, `-`).toLowerCase()
  }, [id, name])
}