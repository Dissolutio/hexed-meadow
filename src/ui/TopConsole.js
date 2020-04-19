import React from 'react'

export const TopConsole = (props) => {
  const { playerID } = props

  return (
    <div>
      <h1>{playerID.toString() === '0' ? 'Bees' : 'Butterflies'}</h1>
    </div>
  )
}
