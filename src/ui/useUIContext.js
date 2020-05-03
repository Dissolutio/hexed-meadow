import React, { useContext, useState } from 'react'
import { useLocalStorage } from '../hooks'

const UIContext = React.createContext([{}, () => { }])

const UIContextProvider = props => {
	const [menuOpen, setMenuOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [selectedContestId, setSelectedContestId] = useLocalStorage('E2PSelectedContest', '')
	const [viewingUserId, setViewingUserId] = React.useState('')
	const UIState = {
		menuOpen,
		selectedDate,
		selectedContestId,
		viewingUserId,
	}
	const setUIState = {
		setMenuOpen,
		setSelectedDate,
		setSelectedContestId,
		setViewingUserId
	}
	return <UIContext.Provider value={[UIState, setUIState]}>{props.children}</UIContext.Provider>
}
const useUIContext = () => {
	const [UIState, setUIState] = useContext(UIContext)
	const { menuOpen, selectedDate, selectedContestId, viewingUserId } = UIState
	const { setMenuOpen, setSelectedDate, setSelectedContestId, setViewingUserId } = setUIState
	// When user switches contest, we adjust the selected date to be within the contest dates

	function toggleMenuOpen() {
		setMenuOpen(!menuOpen)
	}
	function setMenuClose() {
		setMenuOpen(false)
	}
	return {
		// NAV MENU
		menuOpen,
		toggleMenuOpen,
		setMenuClose,
		// DATE
		selectedDate,
		setSelectedDate,
		// CONTEST
		selectedContestId,
		setSelectedContestId,
		// ADMIN
		viewingUserId,
		setViewingUserId
	}
}

export { UIContextProvider, useUIContext }
