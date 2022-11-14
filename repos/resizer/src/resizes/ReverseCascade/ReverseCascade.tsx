import { callback } from '../../utils/callback'

export const ReverseCascade = (data:any) => {
  var e = data.index;
  var d = data.sizes;
  var y = data.from;
  var value = data.to;
  var cp = Math.abs(value - y);
  if (0 === cp) {
    return d;
  }
  var out = callback([], d, true);
  var c = Math.sign(value - y);
  var i = cp;
  var id = 1 === c ? out.length - 1 : 0;
  for (; i > 0;) {
    var end = out[id];
    if (end > 0) {
      var r = Math.max(0, end - i);
      i = i - (end - r);
      out[id] = r;
    } else {
      var i = id - c;
      if (!(i >= 0 && i <= out.length - 1)) {
        break;
      }
      id = i;
    }
  }
  var s = -1 === c ? e - c : e;
  var offset = cp - i;
  var n = d[s] + offset;
  return out[s] = n, out;
};