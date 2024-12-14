import { ipcRenderer } from 'electron'
import { Profile } from '../../../common/models/profile'
import logger from 'electron-log/main'

const initProfile = (name: string): Profile => {
  logger.info('initProfile', name)
  const profile = {
    id: '1',
    name,
    databases: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }

  ipcRenderer.send('stateUpdate', {
    name: 'profiles',
    state: {
      profiles: [profile]
    }
  })

  return profile
}

export const profiles = {
  initProfile
}
