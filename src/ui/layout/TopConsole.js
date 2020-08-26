import React from 'react'
import { useLayoutContext } from 'ui/hooks/useLayoutContext'

import { AppNavbar } from './AppNavbar'

export const TopConsole = () => {
  const { layoutComponents, topConsoleComponent } = useLayoutContext()

  switch (topConsoleComponent) {
    case layoutComponents.navbar:
      return <AppNavbar />
    default:
      return null
  }
}
