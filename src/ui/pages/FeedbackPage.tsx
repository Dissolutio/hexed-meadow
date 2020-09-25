import React from 'react'
import Container from 'react-bootstrap/Container'
import { PageNavbar } from './PageNavbar'

export const FeedbackPage = () => {
  return (
    <Container fluid className="app-theme">
      <PageNavbar />
      <Container>
        <h1>Submit Feedback</h1>
        <p>Feedback Form coming soon!</p>
      </Container>
    </Container>
  )
}
