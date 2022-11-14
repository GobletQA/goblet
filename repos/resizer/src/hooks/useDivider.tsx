import { clone } from '../utils/clone'
import { extend } from '../utils/extend'
import { useDividerMouseEvents } from './useDividerMouseEvents'
import { useDividerTouchEvents } from './useDividerTouchEvents'
import { useDividerKeyboardEvents } from './useDividerKeyboardEvents'


export const useDivider = (_ref:any) => {
  var index = _ref.index;
  var args = _ref.resizeInput;
  var coordinate = _ref.mouseCoordinate;
  var center = _ref.keyboardCoordinate;
  var _ref$mapStateToPropsF = _ref.touchCoordinate;
  var onMouseDown = _ref.onMouseDown;
  var onTouchStart = _ref.onTouchStart;
  var onFocus = _ref.onFocus;
  var onBlur = _ref.onBlur;
  var key = _ref.role;
  var k = void 0 === key ? "separator" : key;
  var name = _ref["aria-label"];
  var label = void 0 === name ? "Resize" : name;
  var a = _ref.className;
  var second = void 0 === a ? "" : a;
  var options = clone(_ref, ["index", "resizeInput", "mouseCoordinate", "keyboardCoordinate", "touchCoordinate", "onMouseDown", "onTouchStart", "onFocus", "onBlur", "role", "aria-label", "className"]);

  var container = s(null);
  var self = container[0];
  var path = container[1];

  var data = useDividerMouseEvents({
    index : index,
    element : self,
    resizeInput : args,
    coordinate : coordinate,
    onMouseDown : onMouseDown
  });
  var defaultBankAccount = useDividerKeyboardEvents({
    index : index,
    element : self,
    resizeInput : args,
    coordinate : center,
    onFocus : onFocus,
    onBlur : onBlur
  });
  var defaultCard = useDividerTouchEvents({
    index : index,
    element : self,
    resizeInput : args,
    coordinate : _ref$mapStateToPropsF,
    onTouchStart : onTouchStart
  });
  var i = l(function() {
    var e = args ? "react-page-split__divider--".concat(args) : "";
    return "react-page-split__divider ".concat(e, " ").concat(second);
  }, [args, second]);
  return extend(extend(extend(extend(extend({}, options), defaultBankAccount), data), defaultCard), {
    ref : path,
    className : i,
    role : k,
    "aria-label" : label
  });
}