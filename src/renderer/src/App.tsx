import { ToastContainer } from 'react-toast'
import { Header } from './components/header'
import { Outlet } from './components/outlet'
import { ProfileUpdater } from './hooks/useDatabaseEnsurer'

function App(): JSX.Element {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Header />
      <Outlet />
      <ProfileUpdater />
    </>
  )
}

export default App
