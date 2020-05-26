import styled from 'styled-components'

export const ArmyListStyle = styled.div`
  display: flex;
  flex-flow: column nowrap;
  color: var(--mainColor);
  h2 {
    font-size: 1.3rem;
    margin: 0;
    text-align: center;
  }
  button {
    color: var(--mainColor);
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
    border: 0.1px solid var(--mainColor);
  }
  img {
    width: auto;
  }
  span {
    font-size: 1rem;
  }
`
