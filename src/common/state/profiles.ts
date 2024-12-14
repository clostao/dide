import { create } from 'zustand'
import { Profile } from '../models/profile'

export interface ProfileState {
  profiles: Profile[]
}

export interface ProfileStore extends ProfileState {
  addProfile: (profile: Profile) => void
  removeProfile: (id: string) => void
  updateProfile: (profile: Profile) => void
  setState: (state: ProfileState) => void
}

export const useProfilesStore = create<ProfileStore>()((set) => ({
  profiles: [],
  addProfile: (profile: Profile): void =>
    set((state) => ({
      profiles: [...state.profiles, profile]
    })),
  removeProfile: (id: string): void =>
    set((state) => ({
      profiles: state.profiles.filter((profile) => profile.id !== id)
    })),
  updateProfile: (profile: Profile): void =>
    set((state) => ({
      profiles: state.profiles.map((p) => (p.id === profile.id ? profile : p))
    })),
  setState: (state: ProfileState): void => set(state)
}))

export const getProfileState = (store: ProfileStore): ProfileState => ({ profiles: store.profiles })
