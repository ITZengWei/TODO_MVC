import React, {
	memo,
	useRef
} from 'react'
import './Control.css'

import PropTypes from 'prop-types'

const Control = memo(props => {
	const {
		addTodo
	} = props

	const inputRef = useRef('')

	const handleKeyDown = (event) => {
		const { keyCode } = event

		if (keyCode !== 13) return

		const text = inputRef.current.value.trim()

		if (!text) return

		addTodo(text)

		inputRef.current.value = ''
	}

	return (
		<header className="header">
			<h1>todos</h1>
			<input
				ref={ inputRef }
				className="new-todo"
				placeholder="What needs to be done?"
				onKeyDown={ handleKeyDown }
				autoFocus
			/>
		</header>
	)
})

Control.propTypes = {
	addTodo: PropTypes.func.isRequired,
}

export default Control