export enum AsyncStatus {
  Idle = 'idle',
  Loading = 'loading',
  Reloading = 'reloading',
  Loaded = 'loaded',
  Error = 'error'
}

export type AsyncValue<T> =
  | {
      status: AsyncStatus.Error
      value: T | null
      error: string
    }
  | {
      status: AsyncStatus.Loading | AsyncStatus.Idle
      value: null
      error: null
    }
  | {
      status: AsyncStatus.Reloading
      value: T
      error: null
    }
  | {
      status: AsyncStatus.Loaded
      value: T
      error: null
    }

export const isLoaded = <T>(
  value: AsyncValue<T>
): value is AsyncValue<T> & { status: AsyncStatus.Loaded } => value.status === AsyncStatus.Loaded

export const initAsyncValue = <T>(): AsyncValue<T> => ({
  status: AsyncStatus.Idle,
  value: null,
  error: null
})
