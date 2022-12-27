import React, { useState } from 'react'
import { PATHS } from '../../constants'

const fileTypeMap = (fileType: string): string => {
  const type = fileType.split('_').slice(-1)[0]
  const config: {
    [index: string]: string
  } = {
    ts: 'typescript',
    js: 'js',
    tsx: 'reactts',
    jsx: 'reactjs',
  }
  return config[type] ? `file_type_${config[type]}` : fileType
}

const Icon: React.FC<{
  type?: string
  style?: React.CSSProperties
  className?: string
}> = ({ type = 'default_file', style = {}, className = '' }) => {
  const [src, setSrc] = useState(`${PATHS.assets}icons/${fileTypeMap(type)}.svg`)
  const handleError = (e: any) => {
    setSrc(`${PATHS.assets}icons/default_file.svg`)
  }

  return (
    <img
      onError={handleError}
      style={style}
      src={src}
      className={`goblet-editor-icons ${className}`}
    />
  )
}

export default Icon
