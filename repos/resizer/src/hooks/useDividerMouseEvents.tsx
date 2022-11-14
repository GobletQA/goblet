export const useDividerMouseEvents = (node:any) => {
  var sourceIndex = node.index;
  var element = node.element;
  var exports = node.resizeInput;
  var start = node.coordinate;
  var touchstart = node.onMouseDown;
  var next = usePageSplitDispatch();
  var onClick = o(function(e) {
    if (null == touchstart || touchstart(e), !e.defaultPrevented && e.target === element && 0 === e.button) {
      var initial = start(e.nativeEvent);
      if (null !== initial) {
        e.preventDefault();
        next({
          type : "ResizeStart",
          input : "mouse",
          index : sourceIndex,
          from : initial
        });
        if (element instanceof HTMLElement) {
          element.focus({
            preventScroll : true
          });
        }
      }
    }
  }, [touchstart, element, start, next, sourceIndex]);
  var annotationBlurSpy = o(function(event) {
    var attendees = start(event);
    if (null !== attendees) {
      event.preventDefault();
      next({
        type : "ResizeMove",
        to : attendees
      });
    }
  }, [start, next]);
  var onclickEdition = o(function(event) {
    event.preventDefault();
    next({
      type : "ResizeEnd"
    });
    if (element instanceof HTMLElement) {
      element.blur();
    }
  }, [next, element]);
  return a(function() {
    return "mouse" === exports ? (addEventListener("mousemove", annotationBlurSpy), addEventListener("mouseup", onclickEdition), function() {
      removeEventListener("mousemove", annotationBlurSpy);
      removeEventListener("mouseup", onclickEdition);
    }) : void 0;
  }, [exports, annotationBlurSpy, onclickEdition]), {
    onMouseDown : onClick
  };
}