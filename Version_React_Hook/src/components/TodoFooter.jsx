import React, {
	memo
} from 'react'

import PropTypes from 'prop-types'

const TodoFooter = memo(props => {
  const {
  	surplus,
	  clearCompletedTodo,
	  current
  } = props

	const isAll = !['active', 'completed'].includes(current)

	return (
		<footer className="footer">
			<span className="todo-count"><strong>{ surplus }</strong> item left</span>
			<ul className="filters">
				<li>
					<a  className={ isAll ? 'selected' : '' } href="#/">All</a>
				</li>
				<li>
					<a href="#/active" className={ current === 'active' ? 'selected' : '' }>Active</a>
				</li>
				<li>
					<a href="#/completed" className={ current === 'completed' ? 'selected' : '' }>Completed</a>
				</li>
			</ul>
			<button className="clear-completed" onClick={ clearCompletedTodo }>Clear completed</button>
		</footer>
	)
})

TodoFooter.propTypes = {
	surplus: PropTypes.number.isRequired,
	current: PropTypes.string.isRequired,
	clearCompletedTodo: PropTypes.func.isRequired
}

export default TodoFooter