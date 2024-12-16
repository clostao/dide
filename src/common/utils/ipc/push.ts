import { contextBridge, ipcMain, ipcRenderer } from 'electron'
import { createMessage, IpcMainSender, MessageWithId, responseEventId } from './common'
import { v4 } from 'uuid'
import logger from 'electron-log/main'

// returningType is the type of the value that the handler returns (the type of the message)
export type PushIpcType<T extends object, O> = {
  eventName: string
  inputType: T | null
  returningType: O | null
}

export type PushIpcHandler<T extends object, O> = (sender: IpcMainSender<T>, args: T) => Promise<O>
export type PushIpcListenerSubscriber<T extends object, O> = (cb: (args: T) => O) => void

type InputPushType<X> = X extends PushIpcType<infer U, unknown> ? U : never

type ReturningPushType<X> = X extends PushIpcType<object, infer V> ? V : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IPCPushServices<T extends Record<string, Record<string, PushIpcType<any, any>>>> = {
  main: {
    [K in keyof T]: {
      [K2 in keyof T[K]]: PushIpcHandler<InputPushType<T[K][K2]>, ReturningPushType<T[K][K2]>>
    }
  }
  renderer: {
    [K in keyof T]: {
      [K2 in keyof T[K] as `on_${string & K2}`]: PushIpcListenerSubscriber<
        InputPushType<T[K][K2]>,
        ReturningPushType<T[K][K2]>
      >
    }
  }
}

export const createPushIpcType = <T extends object, O>(
  eventName: string,
  inputType: T | null = null,
  returningType: O | null = null
): PushIpcType<T, O> => {
  return { eventName, inputType, returningType }
}

export const createPushIpcHandler = <T extends object, O>(
  type: PushIpcType<T, O>
): PushIpcHandler<T, O> => {
  const responseEventName = responseEventId(type.eventName)

  return (sender: IpcMainSender<T>, args: T) => {
    return new Promise<O>((resolve) => {
      sender(type.eventName, createMessage(v4(), args))

      const cb = (_, args: MessageWithId<O>) => {
        logger.info('cb', args)
        resolve(args.message)
        ipcMain.removeListener(responseEventName, cb)
      }
      ipcMain.on(responseEventName, cb)
    })
  }
}

export const createPushIpcListener = <T extends object, O>(
  type: PushIpcType<T, O>
): PushIpcListenerSubscriber<T, O> => {
  const forbiddenChars = [':', ' ']
  if (!type.eventName) {
    throw new Error('Event name is missing')
  }
  if (forbiddenChars.some((char) => type.eventName.includes(char))) {
    throw new Error('Event name contains invalid characters')
  }

  return (cb: (args: T) => O) => {
    ipcRenderer.on(type.eventName, async (_, args: MessageWithId<T>) => {
      const message = createMessage(args.id, await cb(args.message))
      ipcRenderer.send(responseEventId(type.eventName), message)
    })
  }
}

export const createPushIpcServices = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, Record<string, PushIpcType<any, any>>>
>(
  pushIpcHandler: T
): IPCPushServices<T> => {
  const services = {
    main: {},
    renderer: {}
  }

  for (const [namespace, record] of Object.entries(pushIpcHandler)) {
    services.main[namespace] = {}
    services.renderer[namespace] = {}

    const pushIpcTypes = Object.values(record)
    for (const pushIpcType of pushIpcTypes) {
      services.main[namespace][pushIpcType.eventName] = createPushIpcHandler(pushIpcType)

      services.renderer[namespace][`on_${pushIpcType.eventName}`] =
        createPushIpcListener(pushIpcType)
    }
  }

  return services as IPCPushServices<T>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exposePushIpcServicesPreload = (services: IPCPushServices<any>) => {
  try {
    const push = {}
    for (const [namespace, record] of Object.entries(services.renderer)) {
      push[namespace] = {}
      for (const [eventName, listener] of Object.entries(record)) {
        push[namespace][eventName] = listener
      }
    }

    contextBridge.exposeInMainWorld('pushServices', push)
  } catch (error) {
    console.error(error)
  }
}
