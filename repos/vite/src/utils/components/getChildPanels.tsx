
export const getChildPanels = (parentEl:HTMLDivElement, className:string=`.react-page-split`) => {
  const cls = className.startsWith(`.`) ? className : `.${className}`
  const found = parentEl?.querySelector?.(cls)

  return ([
    ...(found?.childNodes || [])
  ] as HTMLDivElement[]).filter(el => el.tagName === `DIV`)
}
