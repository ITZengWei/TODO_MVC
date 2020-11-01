import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef
} from 'react'
import './App.css'

// 引入自定义 Hook hash
import useHashChange from './useHook/useHashChange'

import { bindActionCreators } from './myRedux/index'

import reducer from './myRedux/reducer'

/* 引入 控制组件 */
import Control from './components/Control'

/* 引入 列表组件 */
import TodoList from './components/TodoList'

import TodoFooter from './components/TodoFooter'

/* 引入 底部组件 */
import Footer from './components/Footer'

import {
	createSet,
	createAdd,
	createRemove,
	createToggle,
	createToggleAll,
	createEdit,
	createClearCompleted
} from './myRedux/actions'

const store = {
	todoList: [],
	incrementTodoCount: 0
}

// 本地待办列表 键名
const LOCAL_TODO_LIST = 'local_todo_list'

export default function App() {

	// TODO 如果这里设置的 时候用一个方法 可以么
	const [todoList, setTodoList] = useState(() => {
		return JSON.parse(localStorage.getItem(LOCAL_TODO_LIST) || '[]')
	})

	// 记录添加 待办 次数
	const [incrementTodoCount, setIncrementTodoCount] = useState(0)

	// 如果数据更改了，我们同步到 store 中
	useEffect(() => {
		Object.assign(store, { todoList, incrementTodoCount })
	}, [todoList, incrementTodoCount])

	const dispatch = useCallback(action => {

		// 字段所对应的设置喊
		const setters = {
			todoList: setTodoList,
			incrementTodoCount: setIncrementTodoCount
		}

		// 如果你的 action 是一个函数，代表这是一个异步设置
		if (typeof action === 'function') {
			return action(dispatch, () => store)
		}

		const newState = reducer(store, action)

		for (let key in newState) {
			setters[key](newState[key])
		}
	}, [])


	const controlCbs = useMemo(() => {
		return bindActionCreators({
			addTodo: createAdd
		}, dispatch)
	}, [])


	const todoListCbs = useMemo(() => {
		return bindActionCreators({
			removeTodo: createRemove,
			toggleTodo: createToggle,
			toggleAll: createToggleAll,
			editTodo: createEdit,
		}, dispatch)
	}, [])



	const todoFooterCbs = useMemo(() => {
		return bindActionCreators({
			clearCompletedTodo: createClearCompleted
		}, dispatch)
	}, [])

	// 初始化拿到本地的 todoList 设置值
	useEffect(() => {
		const localTodoList = JSON.parse(localStorage.getItem(LOCAL_TODO_LIST) || '[]')
		dispatch(createSet(localTodoList))
	}, [])


	// 如果我们的 todoList改变了我们就存储到硬盘上
	useEffect(() => {
		const localTodoListStr = JSON.stringify(todoList)
		localStorage.setItem(LOCAL_TODO_LIST, localTodoListStr)
	}, [todoList])


	const hash = useHashChange()


	// 真正过滤展示的 待办列表
	const showTodoList = useMemo(() => {
		switch (hash) {
			// 切换到正在处理
			case 'active' :
				return todoList.filter(todo => !todo.completed)
			// 切换到完成项
			case 'completed' :
				return todoList.filter(todo => todo.completed)
			default :
				return todoList
		}
	}, [todoList, hash])

	// 剩余待办的数量
	const surplusTodoCount = useMemo(() => {
		return todoList.reduce((prev, next) => {
			return prev + (next.completed ? 0 : 1)
		}, 0)
	}, [todoList])

	const isCompletedAll = useMemo(() => {
		// 查看是否为全部完成
		return todoList.every(todo => todo.completed)
	}, [todoList])

	// 待办列表长度
	const todoListLen = useMemo(() => {
		return todoList.length
	}, [todoList])

  return (
    <div className="App">
	    <section className="todoapp">
		    {/* 添加 待办控制组件 */}
		    <Control
			    {
		    	  ...controlCbs
			    }
		    />

		    {/* 待办列表展示组件 */}
		    <TodoList
			    todoList={ showTodoList }
			    originTodoListLen={ todoListLen }
			    isCompletedAll={ isCompletedAll }
			    {
			    	...todoListCbs
			    }
		    />

		    {/* 待办底部过滤组件 */}
		    {
			    todoListLen !== 0 && (
				    <TodoFooter
					    surplus={ surplusTodoCount }
					    current={ hash }
					    {
						    ...todoFooterCbs
					    }
				    />
			    )
		    }
	    </section>
	    <Footer />
    </div>
  )
}

