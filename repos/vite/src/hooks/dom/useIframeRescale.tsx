import { useCallback, MutableRefObject } from 'react'

export const GB_IFRAME_ID = `goblet-browser-iframe`
export const GB_RELATIVE_WIDTH = 1024
export const GB_RELATIVE_HEIGHT = 768
export const GB__RELATIVE_SCALE = 0.83

/**
 * Calculations for scaling the Iframe based on the default width value as defined in the mock-ups
 * Value is set as a constant in GB_RELATIVE_WIDTH
 *
 * Default Dims of template - 1024 x 768
 * Scaled Dims of template - 850 x 636
 * 850/1024 = .83
 * 637/768 = .83
 *
 */
const transformIframe = (
  iframeRef?: MutableRefObject<HTMLIFrameElement | null>,
  scaled: boolean=true
) => {
  if (!scaled) return

  const iframe = iframeRef?.current ||
    (document.getElementById(GB_IFRAME_ID) as HTMLIFrameElement)

  if (!iframe) return

  const { width, height } = (iframe.parentNode as HTMLElement).getBoundingClientRect()

  const scaleW = width / GB_RELATIVE_WIDTH
  const scaleH = height / GB_RELATIVE_HEIGHT
  const amount = scaleW <= scaleH ? scaleW : scaleH
  // console.log(iframe?.contentWindow?.document)
  // iframe.style.transform = `scale(${amount})`
  // iframe.style.transform = `scale(1)`
}

export const useIframeRescale = (
  iframeRef?: MutableRefObject<HTMLIFrameElement | null>,
  scaled?: boolean
) => {
  return useCallback(() => transformIframe(iframeRef, scaled), [scaled])
}
