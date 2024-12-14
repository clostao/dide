import { useCallback } from 'react'
import { PlusIcon } from 'lucide-react'
import { TabType, useTabsStore } from '../state/tabs'

export const Header = (): JSX.Element => {
  const { tabs, selectedTab, addTab, setSelectedTab } = useTabsStore()

  const handleAddDatabase = useCallback(() => {
    addTab({
      type: TabType.NEW_PROFILE,
      name: 'New profile'
    })
  }, [addTab])

  return (
    <header className="flex flex-row justify-start items-center w-full h-10">
      {tabs.map((tab, index) => (
        <div
          className={`px-16 h-full py-2 cursor-pointer ${selectedTab === index ? 'text-blue-500 bg-gray-100 border-b-2 border-blue-500' : ''}`}
          key={index}
          onClick={() => setSelectedTab(index)}
        >
          {tab.type}
        </div>
      ))}
      <div className="text-blue-500 px-2 h-full py-2 cursor-pointer" onClick={handleAddDatabase}>
        <PlusIcon />
      </div>
    </header>
  )
}
