import {useEffect, useRef} from "react"

export const useRequestAnimation = (callback:(...args:any[]) => any) => {

  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  const animate = (time:number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current as number)
  }, [])

}
