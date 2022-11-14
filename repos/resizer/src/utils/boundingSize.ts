export const ZeroBoundingSize = () => {
  return 0
}

export const HorizontalBoundingSize = (row:any) => {
  return row.getBoundingClientRect().width
}

export const VerticalBoundingSize = (item:any) => {
  return item.getBoundingClientRect().height
}