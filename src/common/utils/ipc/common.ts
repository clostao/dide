export type IpcMainSender<T> = (eventName: string, args: MessageWithId<T>) => void

export type MessageWithId<T> = {
  id: string
  message: T
}

export const createMessage = <T>(id: string, message: T) => {
  return {
    id,
    message
  }
}

export const responseEventId = (eventName: string) => `${eventName}:response`
