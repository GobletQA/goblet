import { callback } from '../../utils/callback'

export const Proportional = (data:any) => {
  var end = data.index;
  var str = data.sizes;
  var y = data.from;
  var value = data.to;
  var totalItems = Math.abs(value - y);
  if (0 === totalItems) return str

  var begin;
  var start;
  var size;
  var pageSize;
  var result = callback([], str, true);
  var iTickSize = Math.sign(value - y);
  if (1 === iTickSize) {
    begin = end + 1;
    start = end;
    pageSize = str.slice(end + 1, str.length).filter((count:number) => count > 0).length;
    size = str.slice(0, end + 1).length;
  } else {
    begin = end;
    start = end + 1;
    pageSize = str.slice(0, end + 1).filter((count:number) => count > 0).length;
    size = str.slice(end + 1, str.length).length;
  }
  var green = Math.floor(totalItems / pageSize);
  var sum = 0;
  var i = begin;
  for (; i >= 0 && i <= str.length - 1; i = i + iTickSize) {
    var length = (max = result[i]) - (iret = Math.max(0, max - green));
    result[i] = iret;
    sum = sum + length;
  }
  var remainder = totalItems % pageSize;
  for (; remainder > 0;) {
    var h = false;
    i = begin;
    for (; i >= 0 && i <= str.length - 1; i = i + iTickSize) {
      var iret;
      length = (max = result[i]) - (iret = Math.max(0, max - 1));
      if (result[i] = iret, sum = sum + length, length > 0 && (h = true, 0 === (remainder = remainder - length))) {
        break;
      }
    }
    if (!h) {
      break;
    }
  }
  var scale = sum / size;
  i = start;
  for (; i >= 0 && i <= str.length - 1; i = i - iTickSize) {
    var key = (max = result[i]) + scale;
    result[i] = key;
  }
  var index = sum % size;
  for (; index > 0;) {
    var R = false;
    i = start;
    for (; i >= 0 && i <= str.length - 1; i = i - iTickSize) {
      key = (max = result[i]) + 1;
      var max;
      var diff = max - size;
      if (result[i] = key, diff > 0 && (R = true, 0 === (index = index - diff))) {
        break;
      }
    }
    if (!R) {
      break;
    }
  }
  return result;
};