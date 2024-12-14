import { useCallback, useState } from 'react'
import { Button } from '../components/button'
import { toast } from 'react-toast'
import { TabType, useTabsStore } from '../state/tabs'

export const ProfileCreation = (): JSX.Element => {
  const [name, setName] = useState('')
  const { removeTab, addTab, selectedTab } = useTabsStore()

  const handleCreateProfile = useCallback(async () => {
    if (!name) return toast.error('Profile name is required')

    const profile = window.app.profiles.initProfile(name)
    removeTab(selectedTab)

    addTab({ type: TabType.DATABASE_PROFILE, profileId: profile.id })
  }, [name])

  return (
    <div className="flex flex-col justify-center items-center flex-grow">
      <div className="flex flex-col gap-2 relative bg-white rounded-xl w-[40%]">
        <div className="flex flex-col gap-2 p-4 overflow-hidden z-10 bg-white rounded-xl border border-[#e6e6e6]">
          <h2 className="text-lg font-semibold text-center">New profile</h2>
          <input
            type="text"
            className="ring-1 ring-[#e6e6e6] rounded-md p-2"
            placeholder="Profile name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-row gap-2 mt-4 justify-center">
            <Button classType="primary" className="min-w-40" onClick={handleCreateProfile}>
              Create Profile
            </Button>
          </div>
        </div>
        <div className="h-full w-full absolute top-1 left-1 bg-[#e6e6e6] z-0 rounded-xl" />
      </div>
    </div>
  )
}
