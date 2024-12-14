import { useEffect } from 'react'
import { useProfilesStore } from '../../../common/state/profiles'
import logger from 'electron-log/renderer'
export const ProfileUpdater = (): React.ReactNode => {
  const setState = useProfilesStore((state) => state.setState)

  useEffect(() => {
    const { unsubscribe } = window.state.onStateChange((_, newState) => {
      logger.info('stateUpdate', newState)
      setState(newState)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return <></>
}
