export type Result<T> =
  | {
      success: true
      value: T
    }
  | {
      success: false
      error: string
    }

export const ok = <T>(value: T): Result<T> => ({
  success: true,
  value
})

export const err = <T>(error: string): Result<T> => ({
  success: false,
  error
})
