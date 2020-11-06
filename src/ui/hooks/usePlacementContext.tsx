import React, { useContext, useState } from 'react'
import { useBoardContext } from './useBoardContext'
import { BoardHex } from 'game/mapGen'

const PlacementContext = React.createContext(null)

const PlacementContextProvider = ({ children }) => {
  const {
    G,
    playerID,
    moves,
    // computed
    myUnits,
    myCards,
    myStartZone,
    activeUnit,
    // ui state
    activeUnitID,
    setActiveUnitID,
    setActiveHexID,
    setErrorMsg,
  } = useBoardContext()
  const { boardHexes, gameUnits } = G
  const { placeUnitOnHex } = moves
  const [placementUnits, setPlacementUnits] = useState(
    myInitialPlacementUnits()
  )
  function myInitialPlacementUnits() {
    const myUnitIdsAlreadyOnMap = Object.values(boardHexes)
      .map((bH: BoardHex) => bH.occupyingUnitID)
      .filter((id) => {
        return id && gameUnits[id].playerID === playerID
      })
    return myUnits
      .filter((unit) => !myUnitIdsAlreadyOnMap.includes(unit.unitID))
      .map((unit) => {
        const armyCard = myCards.find((card) => card.cardID === unit.cardID)
        return {
          ...unit,
          name: armyCard.name,
        }
      })
  }
  const placeAvailablePlacementUnit = (unit) => {
    const newState = placementUnits.filter((u) => {
      return !(u.unitID === unit.unitID)
    })
    setPlacementUnits(newState)
  }
  function onClickPlacementUnit(unitID) {
    // either deselect unit, or select unit and deselect active hex
    if (unitID === activeUnitID) {
      setActiveUnitID('')
    } else {
      setActiveUnitID(unitID)
      setActiveHexID('')
    }
  }
  function onClickBoardHex_placement(event, sourceHex) {
    // Do not propagate to background onClick
    event.stopPropagation()
    const hexID = sourceHex.id
    const isInStartZone = myStartZone.includes(hexID)
    //  No unit, select hex
    if (!activeUnitID) {
      setActiveHexID(hexID)
      setErrorMsg('')
      return
    }
    // have unit, clicked in start zone, place unit
    if (activeUnitID && isInStartZone) {
      placeUnitOnHex(hexID, activeUnit)
      placeAvailablePlacementUnit(activeUnit)
      setActiveUnitID('')
      setErrorMsg('')
      return
    }
    // have unit, clicked hex outside start zone, error
    if (activeUnitID && !isInStartZone) {
      setErrorMsg(
        'Invalid hex selected. You must place units inside your start zone.'
      )
      return
    }
  }
  return (
    <PlacementContext.Provider
      value={{
        // PLACEMENT STATE
        placementUnits,
        setPlacementUnits,
        placeAvailablePlacementUnit,
        onClickPlacementUnit,
        onClickBoardHex_placement,
      }}
    >
      {children}
    </PlacementContext.Provider>
  )
}
const usePlacementContext = () => {
  return {
    ...useContext(PlacementContext),
  }
}
export { PlacementContextProvider, usePlacementContext }
