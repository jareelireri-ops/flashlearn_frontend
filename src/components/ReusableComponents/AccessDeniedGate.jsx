import { useContext } from 'react'
import { UIContext } from '../../context/UIContext'
import AccessDeniedBanner from './AccessDeniedBanner'

function AccessDeniedGate() {
  const { accessDeniedMessage, setAccessDeniedMessage } = useContext(UIContext)
  return (
    <AccessDeniedBanner
      message={accessDeniedMessage}
      onClose={() => setAccessDeniedMessage(null)}
    />
  )
}

export default AccessDeniedGate