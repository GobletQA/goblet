import type { RefObject } from 'react'
import { useEffect } from 'react'


export type THLoadSnapImg = {
  imgUrl?:string
  canvasRef: RefObject<HTMLCanvasElement>
}

export type TLoadImage = {
  imgUrl?:string
  canvasRef: RefObject<HTMLCanvasElement>
}

const loadImage = (props:TLoadImage) => {
  const {
    imgUrl,
    canvasRef
  } = props

  if(!imgUrl) return
  const img = new Image()
  img.src = imgUrl

  img.onload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx && ctx.drawImage(img, 0, 0)
  }
}

export const useLoadSnapImg = (props:THLoadSnapImg) => {
  useEffect(
    () => { loadImage(props) },
    [props.imgUrl]
  )
}