export const exhaustiveCheck = (param: never): never => {
  throw new Error(`Unhandled case: ${JSON.stringify(param)}`)
}
