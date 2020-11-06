import React from 'react'

import { PageNavbar } from './PageNavbar'
import { StyledPageWrapper } from './StyledPageWrapper'

export const HelpPage = () => {
  return (
    <>
      <PageNavbar />
      <StyledPageWrapper>
        <div>
          <h1>Help Page</h1>
          <p>This page can:</p>
          <ul>
            <li>Teach you how to play the game.</li>
            <li>Tell you about the project.</li>
            <li>Give some tips</li>
          </ul>
        </div>
      </StyledPageWrapper>
    </>
  )
}
