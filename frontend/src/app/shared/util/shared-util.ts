export function convertEmptyStringToNull(data: any) {
  if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach(key => {
      if (data[key] === '') {
        data[key] = null
      } else if (typeof data[key] === 'object') {
        data[key] = convertEmptyStringToNull(data[key])
      }
    })
  } else if (typeof data === 'string' && data === '') {
    data = null
  }
  return data
}

export function isNullOrUndefined(value: unknown): boolean {
  return value === null || value === undefined
}
