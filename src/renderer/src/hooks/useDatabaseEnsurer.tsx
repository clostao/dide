import { useEffect } from 'react'
import { useProfilesStore } from '../../../common/state/profiles'
import logger from 'electron-log/renderer'

export const ProfileUpdater = (): React.ReactNode => {
  const setState = useProfilesStore((state) => state.setState)

  useEffect(() => {
    window.pushServices.timer.on_tick(({ time }) => {
      const random = Math.random()
      logger.info('timer tick', time, random)

      return random
    })

    return () => {
      // unsubscribe()
    }
  }, [])

  return <></>
}
