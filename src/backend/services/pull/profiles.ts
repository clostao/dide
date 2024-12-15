import { v4 } from 'uuid'
import { Profile } from '../../../common/models/profile'
import { useProfilesStore } from '../../../common/state/profiles'
import logger from 'electron-log/main'

const createProfile = ({ name }: { name: string }): Profile => {
  const profile = {
    id: v4(),
    name,
    databases: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }

  logger.info('createProfile', profile)

  useProfilesStore.getState().addProfile(profile)

  return profile
}

export const profiles = {
  createProfile
}
