import { createPushIpcType } from '../../../common/utils/ipc/push'

export const timer = {
  tick: createPushIpcType<{ time: number }, number>('tick')
}
