import { useProfilesStore } from '../../../common/state/profiles'

export const ProfileView = ({ profileId }: { profileId: string }): JSX.Element => {
  const profile = useProfilesStore((e) => e.profiles.find((p) => p.id === profileId))

  return (
    <div className="flex flex-row h-full w-full border border-right border-gray-200">
      <div className="flex flex-col w-1/4 p-4 border-r border-gray-200 resize overflow-auto">
        <h2 className="text-lg font-bold">Profile &quot;{profile?.name}&quot;</h2>
        <div className="mt-4"></div>
      </div>
      <div className="flex flex-col flex-1 p-4"></div>
    </div>
  )
}
