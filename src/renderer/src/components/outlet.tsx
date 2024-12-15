import { ProfileCreation } from '../views/ProfileCreation'
import { TabType, useTabsStore } from '../state/tabs'
import { exhaustiveCheck } from '../../../common/utils/exhaustiveCheck'
import { ProfileView } from '../views/ProfileView'

export const Outlet = (): JSX.Element => {
  const { tabs, selectedTab } = useTabsStore()

  const tab = tabs.find((_, idx) => idx === selectedTab)

  if (!tab) {
    return <div>No tab selected</div>
  }

  switch (tab.type) {
    case TabType.NEW_PROFILE:
      return <ProfileCreation />
    case TabType.DATABASE_PROFILE:
      return <ProfileView profileId={tab.profileId} />
    default:
      return exhaustiveCheck(tab)
  }
}
