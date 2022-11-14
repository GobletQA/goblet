export const getData = (event:any) => {
  const touches = event.touches
  return touches.length > 0 ? touches[0] : null
}