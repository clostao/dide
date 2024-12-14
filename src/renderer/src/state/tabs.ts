import { create } from 'zustand'

export enum TabType {
  DATABASE_PROFILE = 'database-profile',
  NEW_PROFILE = 'new-profile'
}

export type DatabaseTab = {
  type: TabType.DATABASE_PROFILE
  profileId: string
}

export type NewProfileTab = {
  type: TabType.NEW_PROFILE
  name: string
}

export type Tab = DatabaseTab | NewProfileTab

export type TabsStore = {
  tabs: Tab[]
  selectedTab: number
  addTab: (tab: Tab) => void
  removeTab: (index: number) => void
  setSelectedTab: (index: number) => void
}

export const useTabsStore = create<TabsStore>()((set) => ({
  tabs: [],
  selectedTab: 0,
  addTab: (tab: Tab): void => set((state) => ({ tabs: [...state.tabs, tab] })),
  removeTab: (index: number): void =>
    set((state) => ({ tabs: state.tabs.filter((_, idx) => idx !== index) })),
  setSelectedTab: (index: number): void => set(() => ({ selectedTab: index }))
}))
