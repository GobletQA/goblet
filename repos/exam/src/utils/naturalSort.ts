type TOrgItem = string|number
type TOrgArr = string[]|number[]|TOrgItem[]

type TSortArrItem = TOrgItem|boolean
type TSortArr = TSortArrItem[]
type TDSortArr = TSortArrItem|TSortArr|TSortArr[]
type TSchwartzArr = [TSortArrItem, TSortArrItem, TSortArrItem]

const IntRegEx =/\d+|\D+/g
const FloatRegEx = /[\d\.\-]+|\D+/g

/**
 * Perform a Schwartzian transform, breaking each entry into pieces first
 */
const schwartz = (arr:TSortArr[], regex:RegExp) => {
  for (let idx = arr.length; idx--;)
    (arr[idx] as TDSortArr) = [arr[idx]].concat((arr[idx] + "").match(regex)
      .map((match:string|number) => isNaN(match as number)
        ? [match, false, match]
        : [(match  as number) * 1, true, match]))
  
  return arr
}

/**
 * Find the array with the greatest value
 * Return -1 : 0 : 1 base on the difference
 */
const findGreatest = (arrA:TSchwartzArr[], arrB:TSchwartzArr[], idx:number) => {
  const bothExist = arrA[idx][1] && arrB[idx][1]
  const firstIsLess = arrA[idx][2] < arrB[idx][2]
  const difference = (arrA[idx][0] as number) - (arrB[idx][0] as number)

  return bothExist ? difference : firstIsLess ? -1 : 1
}

/**
 * Loops over the array with the longest amount of sub items
 * Then compares it with the items in the shorter array
 */
const loopLongest = (
  aLength:number,
  bLength:number,
  longest:number,
  arrA:any[],
  arrB:any[],
) => {
  for (let idx=1; idx < longest; ++idx) {
    const notEqual = arrA[idx][0] !== arrB[idx][0]

    if (idx >= aLength) return -1
    else if (idx >= bLength) return 1
    else if (notEqual) return findGreatest(arrA, arrB, idx)
  }

  return 0
}

export const naturalSort = <T extends TOrgArr=TOrgArr>(arr:T, float:boolean=true) => {

  const schwarted = schwartz(
    arr as unknown as TSortArr[],
    float ? FloatRegEx : IntRegEx
  )

  // Perform a cascading sort down the pieces
  schwarted.sort((arrA:any[], arrB:any[]) => {
    const aLength = arrA.length
    const bLength= arrB.length
    const longest = aLength > bLength? aLength : bLength

    return loopLongest(aLength, bLength, longest, arrA, arrB,)
  })

  // Restore the original values into the array
  for (let i=schwarted.length; i--;)
    (schwarted as unknown as T)[i] = (schwarted[i][0] as T[number])

  return schwarted as unknown as T
}