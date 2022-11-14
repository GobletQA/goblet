export const useDividerTouchEvents = (self:any) => {
  var index = self.index;
  var el = self.element;
  var lastTouch = self.resizeInput;
  var parseInt = self.coordinate;
  var touchstart = self.onTouchStart;
  var next = usePageSplitDispatch();
  var activeClass = o(function(e) {
    if (null == touchstart || touchstart(e), !e.defaultPrevented && e.target === el) {
      var droppedItemIndex = parseInt(e.nativeEvent);
      if (null !== droppedItemIndex) {
        next({
          type : "ResizeStart",
          input : "touch",
          index : index,
          from : droppedItemIndex
        });
        if (el instanceof HTMLElement) {
          el.focus({
            preventScroll : true
          });
        }
      }
    }
  }, [touchstart, el, parseInt, next, index]);
  var annotationBlurSpy = o(function(event) {
    var n = parseInt(event);
    if (null !== n) {
      event.preventDefault();
      next({
        type : "ResizeMove",
        to : n
      });
    }
  }, [parseInt, next]);
  var onclickEdition = o(function() {
    next({
      type : "ResizeEnd"
    });
    if (el instanceof HTMLElement) {
      el.blur();
    }
  }, [next, el]);
  return a(function() {
    return "touch" === lastTouch ? (addEventListener("touchmove", annotationBlurSpy), addEventListener("touchend", onclickEdition), function() {
      removeEventListener("touchmove", annotationBlurSpy);
      removeEventListener("touchend", onclickEdition);
    }) : void 0;
  }, [lastTouch, annotationBlurSpy, onclickEdition]), {
    onTouchStart : activeClass
  };
}