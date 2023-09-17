const orgStdOut = process.stdout.write.bind(process.stdout)

// Taken from here
// https://github.com/watson/is-secret/blob/master/index.js

const KEYS = [
  // generic
  /passw(or)?d/i,
  /^pw$/,
  /^pass$/i,
  /secret/i,
  /token/i,
  /api[-._]?key/i,
  /session[-._]?id/i,

  // specific
  /^connect\.sid$/ // https://github.com/expressjs/session
]

const VALUES = [
  /^\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/ // credit card number
]

const isSecret = {
  key: (str:string) => KEYS.some((regex) => regex.test(str)),
  value: (str:string) => VALUES.some((regex) => regex.test(str))
}

const escapeStrForRegEx = (str:string) => {
  return str
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d');
}

const unsafeValues = [
  /token/i,
  /auth/i,
  /bearer/i,
  /passw(or)?d/i,
  /^pw$/,
  /^pass$/i,
  /secret/i,
  /token/i,
  /api[-._]?key/i,
  /session[-._]?id/i,
  /\*\*\*\*[^,}\n\t]*/i,
  /^\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/ // credit card number
]

const unsafeKeyValuePair = [
  { key: `authorization`, value: /^bearer /i },
  { key: `token`, value: /.*/i },
  { key: `password`, value: /.*/i },
  { key: `secret`, value: /.*/i },
]

const Injected:string[] = []

export const injectUnsafe = (items:string[]) => {
  try {
    items.map(item => {
      if(Injected.includes(item)) return

      Injected.push(item)
      unsafeKeyValuePair.push({ key: item, value: /.*/i })
      unsafeValues.push(new RegExp(escapeStrForRegEx(item), "i"))
    })
  }
  catch(err){
    throw new Error(`Could not inject items into Unsafe values`)
  }
}

const possibleArrayKeys = [`stack`, `message`]
const HIDDEN = `****`

const shouldHideUnsafe = (value:string) => {
  return unsafeValues.some((regexp) => regexp.test(value))
}

const safeReplacer = (key:string|number, value:any) => {
  if(key === HIDDEN || value === HIDDEN) return HIDDEN

  if (value instanceof Buffer) return value.toString('base64')
  if (value instanceof Date) return value.toString()

  if (typeof key === `string` && isSecret.key(key)) return HIDDEN
  if (typeof value !== `string`) return value
  if (isSecret.value(value)) return HIDDEN
  if (shouldHideUnsafe(value)) return HIDDEN

  if (typeof key !== `string`) return value

  if (shouldHideUnsafe(key)) return HIDDEN

  const shouldHide = unsafeKeyValuePair.some(({ key: unsafeKey, value: unsafeRegexValue }) => {
    return key === unsafeKey &&  unsafeRegexValue.test(value)
  })

  if(shouldHide) return HIDDEN

  if (possibleArrayKeys.includes(key) && value.indexOf('\n') >= 0)
    return value.split('\n').map((x) => x.trim())

  return value
}

export const replaceUnsafe = (str:string) => {
  try {
    const resp = safeReplacer(str, str)
    return resp !== HIDDEN
      ? str
      : unsafeValues.reduce(
          (final, unsafe) => final.replaceAll(new RegExp(unsafe, "gi"), HIDDEN),
          str
        ) + `\n`
  }
  catch(err){
    // Use set timeout because we are already in a stdout / stderr call and don't want to cause recursive call
    setTimeout(() => console.error(`[ERROR: replaceUnsafe] Could not replace unsafe values from string`), 100)
    return ``
  }
}
