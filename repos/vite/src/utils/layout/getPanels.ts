import { getChildPanels } from './getChildPanels'


export const getPanels = (parentEl:HTMLDivElement|null) => {
  if(!parentEl) return

  const [lPPanel, rPPanel, ...rest] = getChildPanels(parentEl)

  if(!rPPanel) return console.warn(`Could not find Right Horizontal Panel`)

  const [actionsPanel, canvasPanel] = getChildPanels(rPPanel)

  if(!canvasPanel) return console.warn(`Could not find Right Middle Panel, a.k.a. Canvas Panel`)
  if(!actionsPanel) return console.warn(`Could not find Right Top Panel, a.k.a. Actions Panel`)

  return {
    lPPanel,
    rPPanel,
    canvasPanel,
    actionsPanel
  }
}
