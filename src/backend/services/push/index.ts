import { createPushIpcServices } from '../../../common/utils/ipc/push'
import { state } from './state'
import { timer } from './timer'

const rawTypes = {
  state,
  timer
}

export const ipcPushServices = createPushIpcServices(rawTypes)
