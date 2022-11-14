import { extend } from '../utils/extend'
import { callback } from '../utils/callback'

export const pageSplitReducer = (settings:any, self:any) => {
  switch(self.type) {
    case "SetResize":
      return extend(extend({}, settings), {
        resize : self.resize
      });
    case "SetSizeProperty":
      return extend(extend({}, settings), {
        panels : extend(extend({}, settings.panels), {
          sizeProperty : self.property
        })
      });
    case "SetSizes":
      var result = callback([], settings.panels.sizes, true);
      var i = 0;
      for (; i < settings.panels.sizes.length; i++) {
        var item = self.sizes[i];
        var row = settings.panels.elements[i];
        result[i] = void 0 === item ? settings.boundingSize(row) : item;
      }
      return extend(extend({}, settings), {
        panels : extend(extend({}, settings.panels), {
          sizes : result
        })
      });
    case "SetElement":
      var response = callback([], settings.panels.elements, true);
      var index = self.index;
      return null === (item = self.element) ? delete response[index] : response[index] = item, extend(extend({}, settings), {
        panels : extend(extend({}, settings.panels), {
          elements : response
        })
      });
    case "ResizeStart":
      var require = settings.boundingSize;
      var data = (response = settings.panels, settings.drag);
      var temp = (index = self.index, self.input);
      var min = self.from;
      if ((null == data ? void 0 : data.index) === index && "keyboard" !== (null == data ? void 0 : data.input)) {
        return settings;
      }
      result = [];
      i = 0;
      for (; i < response.elements.length; i++) {
        var item;
        if (void 0 === (item = response.elements[i])) {
          break;
        }
        result[i] = require(item);
      }
      return extend(extend({}, settings), {
        panels : extend(extend({}, settings.panels), {
          sizes : result
        }),
        drag : {
          index : index,
          input : temp,
          sizes : result,
          from : min
        },
        event : {
          type : "ResizeStart",
          input : temp,
          index : index,
          from : min
        }
      });
    case "ResizeMove":
      data = settings.drag;
      var resize = settings.resize;
      if (null === data) {
        return settings;
      }
      var pos = self.to;
      index = data.index;
      temp = data.input;
      min = data.from;
      result = data.sizes;
      return pos === data.to ? settings : extend(extend({}, settings), {
        panels : extend(extend({}, settings.panels), {
          sizes : resize({
            index : index,
            input : temp,
            sizes : result,
            from : min,
            to : pos
          })
        }),
        drag : extend(extend({}, data), {
          to : pos
        }),
        event : {
          type : "ResizeMove",
          to : pos
        }
      });
    case "ResizeEnd":
      return extend(extend({}, settings), {
        drag : null,
        event : {
          type : "ResizeEnd"
        }
      });
  }
}
