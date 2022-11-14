import { callback } from '../../utils/callback'

export const Cascade = (data:any) => {
  var e = data.index;
  var result = data.sizes;
  var y = data.from;
  var value = data.to;
  var cp = Math.abs(value - y);
  if (0 === cp) {
    return result;
  }
  var out = callback([], result, true);
  var c = Math.sign(value - y);
  var i = cp;
  var s = 1 === c ? e + c : e;
  for (; i > 0;) {
    var end = out[s];
    if (end > 0) {
      var r = Math.max(0, end - i);
      i = i - (end - r);
      out[s] = r;
    } else {
      var e = s + c;
      if (!(e >= 0 && e <= out.length - 1)) {
        break;
      }
      s = e;
    }
  }
  var type = -1 === c ? e - c : e;
  var offset = cp - i;
  var start = result[type] + offset;
  return out[type] = start, out;
};