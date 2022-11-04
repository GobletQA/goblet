
export type TParseUriOpt = {
  start?: RegExp
  end?: RegExp
  trim?: RegExp
  parens?: RegExp
  ignoreHtml?: boolean
  ignore?: RegExp
}

export type TParseUri = {
  start: RegExp
  end: RegExp
  trim: RegExp
  parens: RegExp
}

export type TReplaceCB = (
  slice:string,
  start:number,
  end:number,
  string:string
) => string | undefined

const findUri:TParseUri = {
  // valid "scheme://" or "www."
  start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
  // everything up to the next whitespace
  end: /[\s\r\n]|$/,
  // trim trailing punctuation captured by end RegExp
  trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/,
  // balanced parens inclusion (), [], {}, <>
  parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g,
}

export const uriReplacer = (
  string:string,
  callback:TReplaceCB,
  options?:TParseUriOpt
) => {
  options || (options = {})

  const {
    start:_start,
    end:_end,
    trim:_trim,
    parens:_parens,
  }:TParseUri = {
    ...findUri,
    ...options,
  }

  const _attributeOpen = /[a-z0-9-]=["']?$/i
  _start.lastIndex = 0

  while (true) {
    const match = _start.exec(string)
    if (!match) break

    const start = match.index

    if (options.ignoreHtml) {
      const attributeOpen = string.slice(Math.max(start - 3, 0), start)
      if (attributeOpen && _attributeOpen.test(attributeOpen)) continue
    }

    let end = start + string.slice(start).search(_end)
    let slice = string.slice(start, end)

    // make sure we include well balanced parens
    var parensEnd = -1;
    while (true) {
      const parensMatch = _parens.exec(slice);
      if (!parensMatch) break

      var parensMatchEnd = parensMatch.index + parensMatch[0].length
      parensEnd = Math.max(parensEnd, parensMatchEnd)
    }

    slice = parensEnd > -1
      ? slice.slice(0, parensEnd) + slice.slice(parensEnd).replace(_trim, '')
      : slice.replace(_trim, '')

    // e.g. "www" or "http://"
    if (slice.length <= match[0].length) continue

    if (options.ignore && options.ignore.test(slice)) continue

    end = start + slice.length
    let result = callback(slice, start, end, string)
    if (result === undefined) {
      _start.lastIndex = end
      continue
    }

    result = String(result)
    string = string.slice(0, start) + result + string.slice(end)
    _start.lastIndex = start + result.length
  }

  _start.lastIndex = 0
  return string
}