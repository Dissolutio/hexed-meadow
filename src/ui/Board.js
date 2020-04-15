import React, { useState } from 'react'
import styled from 'styled-components';
// import { BoardContextProvider, useBoardContext } from './useBoardContext'

export default function Board(props) {
  // BGio props
  const { G, ctx, moves, events, reset, redo, undo, step, log, gameID, playerID, gameMetadata } = props
  // const boardHexes = G.boardHexes
  // const startZones = G.startZones
  // const mapSize = G.mapSize
  // const armyCardsInGame = G.armyCardsInGame
  // const startingUnits = G.startingUnits

  const currentPhase = ctx.phase
  const currentPlayer = ctx.currentPlayer
  const activePlayers = ctx.activePlayers
  const numPlayers = ctx.numPlayers
  const currentTurn = ctx.turn
  const currentRound = Math.floor((currentTurn - 1) / numPlayers)

  const { placeUnit } = moves
  // const startZone = startZones[playerID]
  // const allUnits = Object.values(startingUnits)

  // const [activeHexID, setActiveHexID] = useState('')
  // const [activeUnitID, setActiveUnitID] = useState('')
  // const [availableUnits, setAvailableUnits] = useState(() => (initialAvailableUnits(allUnits)))
  // const [zoomLevel, setZoomLevel] = useState(5)
  // const [errorMsg, setErrorMsg] = useState('')

  // const selectedUnit = startingUnits[activeUnitID]

  // function initialAvailableUnits(allUnits) {
  //     const unitsOnBoard: string[] = Object.values(boardHexes).map(hex => hex.occupyingUnitID).filter(id => Boolean(id))
  //     console.log('%c⧭', 'color: #917399', unitsOnBoard);
  //     return allUnits
  //         .filter((unit: IUnit) => unit.playerID === playerID)
  //         // remove if unit is on board
  //         .filter((unit: IUnit) => {
  //             return (!Object.keys(startingUnits).includes(unit.unitID))
  //         })
  //         .map((gameUnit: IUnit) => {
  //             return {
  //                 unitID: gameUnit.unitID,
  //                 name: armyCardsInGame[gameUnit.hsCardID].name,
  //                 image: armyCardsInGame[gameUnit.hsCardID].image,
  //             }
  //         })
  // }

  // function onClickBoardHex(event, sourceHex) {
  //     // Keep from causing onMapClick
  //     event.stopPropagation()
  //     const hexID = sourceHex.id
  //     const isInStartZone = startZone.includes(hexID)
  //     // EITHER
  //     //  Select hex
  //     if (!activeUnitID) {
  //         console.log("SELECT HEX", activeUnitID)
  //         setActiveHexID(hexID)
  //         setErrorMsg('')
  //         return
  //     }
  //     // or Place unit
  //     if (activeUnitID && isInStartZone) {
  //         placeUnit(hexID, selectedUnit)
  //         setAvailableUnits(availableUnits.filter((unit) => unit.unitID !== activeUnitID))
  //         setActiveUnitID('')
  //         setErrorMsg('')
  //         return
  //     }
  //     // or Can't place unit, because not in start zone
  //     if (activeUnitID && !isInStartZone) {
  //         console.log("CANNOT PLACE UNIT -- choose hex inside start zone", activeUnitID)
  //         setErrorMsg("You must place units inside your start zone. Invalid hex selected.")
  //         return
  //     }
  // }

  // function onClickMapBackground() {
  //     console.log("MAP BG CLICKED")
  //     setActiveHexID('')
  // }

  // function onClickPlacementUnit(unitID) {
  //     // either deselect unit, or select unit and deselect active hex
  //     if (unitID === activeUnitID) {
  //         setActiveUnitID('')
  //     } else {
  //         setActiveUnitID(unitID)
  //         setActiveHexID('')
  //     }
  // }

  // const mapProps = {
  //     boardHexes,
  //     startZones,
  //     mapSize,
  //     zoomLevel,
  //     armyCardsInGame,
  //     startingUnits,
  //     playerID,
  //     activeHexID,
  //     activeUnitID,
  //     onClickBoardHex,
  //     onClickMapBackground,
  // }

  // const dataReadoutProps = {
  //     currentPhase,
  //     currentPlayer,
  //     activePlayers,
  //     numPlayers,
  //     currentTurn,
  //     currentRound,
  // }

  return (
    <>
      <LayoutFlexColumn>
        <TopConsole>
        </TopConsole>
        <MainDisplay className={`board-${playerID}`} >

        </MainDisplay>
        <BottomConsole>

        </BottomConsole>
      </LayoutFlexColumn >
    </>
  )
}

const LayoutFlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    background-color: black;
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
`;
const TopConsole = styled.div`
    /* position: fixed;
    top: 0; */
    background: yellow;
    color: white;
    height: 10%;
    width: 100%;
    `;
const MainDisplay = styled.div`
    height: 75%;
    overflow: scroll;
    width: 100%;
    &.board-0 {
      background: var(--black);
      background: radial-gradient(ellipse at top, var(--blue), transparent), radial-gradient(ellipse at bottom, var(--black), transparent);
        /* background: linear-gradient(121deg, var(--blue) 0%, rgba(53,53,54,1) 50%, rgba(53,53,54,1) 100%); */
        ::-webkit-scrollbar-track-piece {
          box-shadow: inset 0 0 3px var(--blue);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--blue);
        }
      }
    &.board-1 {
      background: var(--black);
        background: radial-gradient(ellipse at top, var(--red), transparent), radial-gradient(ellipse at bottom, var(--black), transparent);
        /* background: linear-gradient(121deg, var(--red) 0%, rgba(53,53,54,1) 50%, rgba(53,53,54,1) 100%); */
        ::-webkit-scrollbar-track-piece {
            box-shadow: inset 0 0 5px var(--red);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--red);
          }
        }
        ::-webkit-scrollbar {
          width: 1rem;
        }
        ::-webkit-scrollbar-track-piece {
        border-radius: 10px;
      }
    ::-webkit-scrollbar-corner {
      background: black;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
      }
    ::-webkit-scrollbar-thumb:hover {
        background: var(--neon-orange);
      }
`;

const BottomConsole = styled.div`
    /* position: fixed;
    bottom: 0; */
    background: yellow;
    height: 15%;
    width: 100%;
    section.data-readout {
      display: flex;
      flex-flow: column wrap; 
      height: 100%;
        color: white;
        font-size: 0.8rem;
    }
`
