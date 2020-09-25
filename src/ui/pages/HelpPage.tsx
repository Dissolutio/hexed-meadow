import React from 'react'
import Container from 'react-bootstrap/Container'
import { PageNavbar } from './PageNavbar'

export const HelpPage = () => {
  return (
    <Container fluid className="app-theme">
      <PageNavbar />
      <Container>
        <h1>Help with Hexed Meadow</h1>
        <p>This page can:</p>
        <ul>
          <li>Teach you how to play the game</li>
          <li>Tell you about the project</li>
          <li>...and so much more, eventually :)</li>
        </ul>
      </Container>
    </Container>
  )
}
