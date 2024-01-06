
export type TMapper<ValueType, MappedValueType> = (
  element: ValueType,
  index: number
) => PromiseLike<MappedValueType> | MappedValueType

export const promiseSeries = async <ValueType, MappedValueType>(
  iterable:Iterable<PromiseLike<ValueType> | ValueType>,
  mapper:TMapper<ValueType, MappedValueType>
):Promise<MappedValueType[]> => {
  const result = []
  let index = 0

  for (const value of iterable)
    result.push(await mapper(await value, index++))

  return result
}
