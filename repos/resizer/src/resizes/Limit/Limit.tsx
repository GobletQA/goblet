import { callback } from '../../utils/callback'

export const Limit = (data:any) => {
  var index = data.index;
  var p = data.sizes;
  var y = data.from;
  var value = data.to;
  var m = Math.abs(value - y);
  if (0 === m) {
    return p;
  }
  var left = Math.sign(value - y);
  var i = 1 === left ? index + left : index;
  var e = Math.max(0, p[i] - m);
  var offset = p[i] - e;
  var j = -1 === left ? index - left : index;
  var n = p[j] + offset;
  var result = callback([], p, true);
  return result[i] = e, result[j] = n, result;
};