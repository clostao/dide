import { ipcMain, ipcRenderer } from 'electron'
import { v4 } from 'uuid'
import logger from 'electron-log/main'
export interface IPCHandler<T, O> {
  eventName: string
  callback: (args: T) => O
}

type MessageWithId<T> = {
  id: string
  message: T
}

const createResponseMessage = <T>(id: string, message: T) => {
  return {
    id,
    message
  }
}

const responseEventId = (eventName: string) => `${eventName}:response`

export const createIpcHandler = <T, O>(
  eventName: string,
  callback: (args: T) => O
): IPCHandler<T, O> => {
  if (eventName.includes(':')) {
    throw new Error('Event name cannot contain ":"')
  }

  return {
    eventName,
    callback
  }
}

export const registerMainIpcHandler = <T, O>(
  handler: IPCHandler<T, O>,
  sender: (eventName: string, args: MessageWithId<O>) => void
) => {
  logger.info('registerMainIpcHandler', handler.eventName)

  ipcMain.on(handler.eventName, (_, args: MessageWithId<T>) => {
    logger.info('registerMainIpcHandler', handler.eventName, args)
    const response = createResponseMessage(args.id, handler.callback(args.message))
    sender(responseEventId(handler.eventName), response)
  })
}

export const registerRendererIPCHandler = <T, O>(handler: IPCHandler<T, O>) => {
  return (args: T) =>
    new Promise((resolve) => {
      const id = v4()

      const responseEventName = responseEventId(handler.eventName)
      const cb = (_, args: MessageWithId<O>) => {
        if (args.id === id) {
          resolve(args.message)
          ipcRenderer.removeListener(responseEventName, cb)
        }
      }
      ipcRenderer.on(responseEventName, cb)

      logger.info('sending message from renderer', handler.eventName, args)
      ipcRenderer.send(handler.eventName, {
        id,
        message: args
      })
    })
}

export const createNamespacedIpcHandlers = (
  namespace: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlers: Record<string, IPCHandler<any, any>['callback']>
) => {
  if (namespace.includes('.')) {
    throw new Error('Namespace must not contain "."')
  }
  if (namespace.includes(':')) {
    throw new Error('Namespace must not contain ":"')
  }

  return Object.entries(handlers).map(([key, handler]) =>
    createIpcHandler(namespace + '.' + key, handler)
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createNamespaceWindowObject = (handlers: IPCHandler<any, any>[]) => {
  return Object.fromEntries(
    handlers.map((e) => [e.eventName.split('.')[1], registerRendererIPCHandler(e)])
  )
}
