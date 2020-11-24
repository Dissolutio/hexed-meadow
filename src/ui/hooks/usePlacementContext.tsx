import React, {
  createContext,
  SyntheticEvent,
  useContext,
  useState,
} from 'react'
import { useBoardContext } from './useBoardContext'
import { BoardHex } from 'game/mapGen'
import { ArmyCard, GameUnit } from 'game/startingUnits'

const PlacementContext = createContext<Partial<PlacementContextValue>>({})

const usePlacementContext = () => {
  return {
    ...useContext(PlacementContext),
  }
}

export type PlacementUnit = GameUnit & {
  name: string
}
type PlacementContextValue = {
  // state
  placementUnits: PlacementUnit[]
  setPlacementUnits: React.Dispatch<React.SetStateAction<PlacementUnit[]>>
  removeUnitFromAvailable: (unit: GameUnit) => void
  // handlers
  onClickPlacementUnit: (unitID: string) => void
  onClickBoardHex_placement: (
    event: React.SyntheticEvent,
    sourceHex: BoardHex
  ) => void
}
const PlacementContextProvider: React.FC = (props) => {
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
    selectedUnitID,
    setSelectedUnitID,
    setActiveHexID,
    setErrorMsg,
  } = useBoardContext()
  const { boardHexes, gameUnits } = G
  const { placeUnitOnHex } = moves
  //🛠 STATE
  const [placementUnits, setPlacementUnits] = useState((): PlacementUnit[] => {
    const myUnitIdsAlreadyOnMap = Object.values(boardHexes)
      .map((bH: BoardHex) => bH.occupyingUnitID)
      .filter((id) => {
        return id && gameUnits[id].playerID === playerID
      })
    const units = myUnits
      .filter((unit: GameUnit) => !myUnitIdsAlreadyOnMap.includes(unit.unitID))
      .map((unit) => {
        const armyCard = myCards.find(
          (card: ArmyCard) => card.cardID === unit.cardID
        )
        return {
          ...unit,
          name: armyCard.name,
        }
      })
    return units
  })
  const removeUnitFromAvailable = (unit: GameUnit) => {
    const newState = placementUnits.filter((u) => {
      return !(u.unitID === unit.unitID)
    })
    setPlacementUnits(newState)
  }
  //🛠 HANDLERS
  function onClickPlacementUnit(unitID: string) {
    // either deselect unit, or select unit and deselect active hex
    if (unitID === selectedUnitID) {
      setSelectedUnitID('')
    } else {
      setSelectedUnitID(unitID)
      setActiveHexID('')
    }
  }
  function onClickBoardHex_placement(
    event: SyntheticEvent,
    sourceHex: BoardHex
  ) {
    // Do not propagate to background onClick
    event.stopPropagation()
    const hexID = sourceHex.id
    const isInStartZone = myStartZone.includes(hexID)
    //  No unit, select hex
    if (!selectedUnitID) {
      setActiveHexID(hexID)
      setErrorMsg('')
      return
    }
    // have unit, clicked in start zone, place unit
    if (selectedUnitID && isInStartZone) {
      placeUnitOnHex(hexID, activeUnit)
      removeUnitFromAvailable(activeUnit)
      setSelectedUnitID('')
      setErrorMsg('')
      return
    }
    // have unit, clicked hex outside start zone, error
    if (selectedUnitID && !isInStartZone) {
      setErrorMsg(
        'Invalid hex selected. You must place units inside your start zone.'
      )
      return
    }
  }

  return (
    <PlacementContext.Provider
      value={{
        // state
        placementUnits,
        setPlacementUnits,
        removeUnitFromAvailable,
        // handlers
        onClickPlacementUnit,
        onClickBoardHex_placement,
      }}
    >
      {props.children}
    </PlacementContext.Provider>
  )
}

export { PlacementContextProvider, usePlacementContext }
