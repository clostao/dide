import { ipcRenderer } from 'electron'
import { ProfileState } from '../../common/state/profiles'

type StateUpdateEventHandler = (stateName: 'profiles', state: ProfileState) => void

export type StateUpdateEvent = {
  name: 'profiles'
  state: ProfileState
}

const onStateChange = (callback: StateUpdateEventHandler) => {
  const cb = (_event, value: StateUpdateEvent) => {
    if (value.name === 'profiles') {
      callback(value.name, value.state)
    }
  }

  ipcRenderer.on('stateUpdate', cb)

  return {
    unsubscribe: () => {
      ipcRenderer.removeListener('stateUpdate', cb)
    }
  }
}

export const state = {
  onStateChange
}
