import React, {
	memo,
	useState,
	useEffect,
	useRef
} from 'react'
import './TodoList.css'

import PropTypes from 'prop-types'

const TodoItem = props => {
	const {
		todo: {
			text,
			id,
			completed
		},
		toggleTodo,
		removeTodo,
		editTodo,
		isCurrentEdit,
		setCurrentEdit
	} = props

	// 上一次点击的时间
	const lastClickTime = useRef(0)


	// 设置内部 text 提高性能
	const [innerText, setInnerText] = useState(text)

	// 如果父组件里面的 text 改变了我们就重置
	useEffect(() => {
		setInnerText(text)
	}, [text])

	const editInput = useRef()

	const className = []


	if (completed) {
		className.push('completed')
	}

	if (isCurrentEdit) {
		className.push('editing')
	}

	const handleDoubleClick = () => {
		const now = Date.now()
		// 判断当前时间和上一次的间隔是否符合

		if (now - lastClickTime.current < 300) {
			setCurrentEdit(id)
		}

		lastClickTime.current = now
	}

	const handleKeyDown = (event) => {
		const { keyCode } = event
		console.log(keyCode)
		// 如果不是回车直接 返回不做处理
		if (keyCode !== 13) return

		handleBlur()
	}

	const handleEdit = () => {
		const { value } = editInput.current

		const text = value.trim()

		setInnerText(text)
	}

	// 当我们失去焦点的时候，设置一下修改的内容，并且重置编辑的那一项
	const handleBlur = () => {
		setCurrentEdit(-1)

		if (innerText) {}

		// 如果 innerText 有值代表编辑 没有值我们这里直接删除
		innerText ? editTodo(id, innerText) : removeTodo(id)

	}

	useEffect(() => {
		if (!isCurrentEdit) return

		console.log('focus')
		// 让 编辑输入框 获得焦点
		editInput.current.focus()

		editInput.current.addEventListener('blur', handleBlur)

		return () => {
			editInput.current.removeEventListener('blur', handleBlur)
		}
	}, [isCurrentEdit])


  return (
	  <li className={ className.join(' ') }>
		  <div className="view">
			  <input
				  className="toggle"
				  type="checkbox"
				  checked={ completed }
				  onChange={ () => toggleTodo(id) }
			  />
			  <label onClick={ () => handleDoubleClick() }>{ innerText }</label>
			  <button className="destroy" onClick={ () => removeTodo(id) }></button>
		  </div>
		  <input
			  ref={ editInput }
			  onChange={ () => handleEdit() }
			  onKeyDown={ handleKeyDown }
			  className="edit"
			  value={ innerText }
		  />
	  </li>
  )
}

TodoItem.propTypes = {
	todo: PropTypes.object.isRequired,
	toggleTodo: PropTypes.func.isRequired,
	removeTodo: PropTypes.func.isRequired,
	editTodo: PropTypes.func.isRequired,
	isCurrentEdit: PropTypes.bool.isRequired,
	setCurrentEdit: PropTypes.func.isRequired,
}

const TodoList = memo(props => {
  const {
	  todoList,
	  originTodoListLen,
	  isCompletedAll,
	  toggleTodo,
	  toggleAll,
	  removeTodo,
	  editTodo,
  } = props

	const [currentEditTodoId, setCurrentEditTodoId] = useState(null)


	return (
		<section className="main">
			{
				originTodoListLen !== 0 && (
					<>
						<input
							id="toggle-all"
							className="toggle-all"
							type="checkbox"
							checked={ isCompletedAll }
							onChange={ () => toggleAll(!isCompletedAll) }
						/>
						<label htmlFor="toggle-all">Mark all as complete</label>
					</>
				)
			}

			<ul className="todo-list">
				{
					todoList.map(todo => (
						<TodoItem
							key={ todo.id }
							isCurrentEdit={ currentEditTodoId === todo.id }
							setCurrentEdit={ setCurrentEditTodoId }
							todo={ todo }
							toggleTodo={ toggleTodo }
							removeTodo={ removeTodo }
							editTodo={ editTodo }
						/>
					))
				}
			</ul>
		</section>
	)
})

TodoList.propTypes = {
	todoList: PropTypes.array.isRequired,
	originTodoListLen: PropTypes.number.isRequired,
	isCompletedAll: PropTypes.bool.isRequired,
	toggleTodo: PropTypes.func.isRequired,
	toggleAll: PropTypes.func.isRequired,
	removeTodo: PropTypes.func.isRequired,
	editTodo: PropTypes.func.isRequired,
}

export default TodoList