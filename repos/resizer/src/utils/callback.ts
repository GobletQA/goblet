export const callback = (...args:any) => {

  const [
    results,
    n,
    elem
  ] = args

  if (elem || 2 === args.length) {
    var result;
    var e = 0;
    var el = n.length;
    for (; e < el; e++) {
      if (!(!result && e in n)) {
        if (!result) {
          result = Array.prototype.slice.call(n, 0, e);
        }
        result[e] = n[e];
      }
    }
  }

  return results.concat(result || Array.prototype.slice.call(n));
}