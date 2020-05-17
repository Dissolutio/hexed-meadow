import React from 'react'
import { useLayoutContext } from '../hooks/useLayoutContext'

import { NavBar } from './NavBar'

export const TopConsole = () => {
  const { layoutComponents, topConsoleComponent } = useLayoutContext()

  switch (topConsoleComponent) {
    case layoutComponents.navbar:
      return <NavBar />
    default:
      return null
  }
}
