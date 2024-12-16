import { createPushIpcType } from '../../../common/utils/ipc/push'
import { StateUpdateEvent } from '../state'

export const state = {
  stateUpdate: createPushIpcType<StateUpdateEvent, void>('stateUpdate'),
  stateUpdateWithAck: createPushIpcType<StateUpdateEvent, boolean>('stateUpdateWithAck')
}
