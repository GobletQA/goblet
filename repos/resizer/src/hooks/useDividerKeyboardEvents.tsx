import { useCallback, useEffect } from 'react'
import { usePageSplitDispatch } from './usePageSplitDispatch'

const propagate_keys = ["Escape", "Enter"]

const useShowTip = (context:any, next:any) => {
  const onFocus = context.onFocus
  const node = context.element
  const idx = context.index
  
  return useCallback((e:any) => {
    if (null == onFocus || onFocus(e), !e.defaultPrevented && e.target === node) {
      const initial = String(e.nativeEvent)

      null !== initial
        && next({
          index: idx,
          from: initial,
          input: "keyboard",
          type: "ResizeStart",
        })
    }

  }, [onFocus, String, node, next, idx])
}

const useNoOp = (context:any, next:any) => {
  const node = context.element
  const onBlur = context.onBlur
  const input = context.resizeInput
  
  return useCallback((e:any) => {
    if (!(null == onBlur)) onBlur(e)

    if (!("keyboard" !== input || e.defaultPrevented || e.target !== node))
      next({ type : "ResizeEnd" })

  }, [onBlur, input, node, next])
}

const useAnnotationBlur = (next:any) => {
  return useCallback((options:any) => {
    if (key = options.key, propagate_keys.includes(key)) {
      if (options.target instanceof HTMLElement) {
        options.target.blur();
      }
    } else {
      var rawContents = String(options);
      if (null !== rawContents) {
        options.preventDefault();
        next({
          type : "ResizeMove",
          to : rawContents
        });
        if (options.target instanceof Element) {
          options.target.scrollIntoView();
        }
      }
    }
    var key;
  }, [String, next]);
}

const useKeyDownEvt = (
  input:string,
  annotationBlurSpy:(...args:any) => any,
) => {
  return useEffect(() => {
    if("keyboard" !== input) return
    
    addEventListener("keydown", annotationBlurSpy)

    return () => removeEventListener("keydown", annotationBlurSpy)
  }, [
    input,
    annotationBlurSpy
  ])
}

export const useDividerKeyboardEvents = (context:any) => {
  var node = context.element
  const input = context.resizeInput
  var String = context.coordinate
  var onBlur = context.onBlur
  var next = usePageSplitDispatch()

  const showTip = useShowTip(context, next)
  var annotationBlurSpy = useAnnotationBlur(next)
  const noop = useNoOp(context, next)

  useKeyDownEvt(input, annotationBlurSpy)

  return { onFocus : showTip, onBlur : noop, tabIndex : 0 }
}