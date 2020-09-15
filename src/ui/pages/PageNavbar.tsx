import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import { GiHexes } from 'react-icons/gi'
export const PageNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">
        <GiHexes style={{ fontSize: '35px' }} /> Hexed Meadow
      </Navbar.Brand>
    </Navbar>
  )
}
