import React from 'react'
import styled from 'styled-components'

export const ArmyListStyle = styled.div`
  display: flex;
  flex-flow: column nowrap;
  color: ${(props) => props.theme.playerColors[props.playerID]};
  h2 {
    font-size: 1.3rem;
    margin: 0;
    text-align: center;
  }
  button {
    color: ${(props) => props.theme.playerColors[props.playerID]};
  }
  ul {
    display: flex;
    flex-flow: row wrap;
    flex-grow: 1;
    list-style-type: none;
    margin: 0;
    padding: 0;
    li {
      padding: 0.3rem;
    }
  }
  button {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-content: center;
    background: var(--black);
    width: 100%;
    height: 100%;
    color: ${(props) => props.theme.playerColors[props.playerID]};
    border: 0.1px solid ${(props) => props.theme.playerColors[props.playerID]};
  }
  img {
    width: auto;
  }
  span {
    font-size: 1rem;
  }
`
