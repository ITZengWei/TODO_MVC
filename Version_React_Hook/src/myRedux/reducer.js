import { combineReducers } from './index'
import {
	ACTION_SET_TODO,
	ACTION_TOGGLE_TODO,
	ACTION_ADD_TODO,
	ACTION_REMOVE_TODO,
	ACTION_CLEAR_COMPLETED_TODO,
	ACTION_EDIT_TODO,
	ACTION_TOGGLE_ALL_TODO,

} from './actionTypes'


const store = {
	state: {
		todoList: [],
		incrementCount: 0
	},
	mutations: {
		setTodo() {},
		setIncrement() {},
	},
	actions: {
		addAction({ commit }) {
			commit('setTodo')
			commit('setIncrement')
		}
	}
}

// 待办的 唯一Id
let uId = + Date.now()

export const reduces = {
	todoList(state, action) {
		const { payload, type } = action

		console.log(`type：${ type }`)

		switch (type) {
			// 初始化 todoList
			case ACTION_SET_TODO :
				return payload
			// 添加 待办
			case ACTION_ADD_TODO :
				const newTodo = {
					id: ++uId,
					text: payload,
					completed: false
				}

				return [
					newTodo,
					...state
				]
			// 切换 该待办的完成状态
			case ACTION_TOGGLE_TODO :
				return state.map(todo => {
					if (todo.id === payload) {
						todo.completed = !todo.completed
						// return {
						// 	...todo,
						// 	completed: !todo.completed
						// }
					}

					return todo
				})

			// 切换所有待办的完成状态
			case ACTION_TOGGLE_ALL_TODO :
				return payload

			// 修改这个待办
			case ACTION_EDIT_TODO :
				return state.map(todo => {
					if (todo.id === payload.id) {
						Object.assign(todo, payload)
					}

					return todo
				})
			// 删除这个待办
			case ACTION_REMOVE_TODO :
				return state.filter(todo => todo.id !== payload)

			// 清空完成的待办
			case ACTION_CLEAR_COMPLETED_TODO :
				return state.filter(todo => !todo.completed)
			default :
				return state
		}
	},
	// 添加待办的次数
	incrementTodoCount(state, action) {
		const { payload, type } = action
		switch (type) {
			// 如果添加了代办，我们就让它 + 1
			case ACTION_ADD_TODO :
				return state + 1
			default :
				return state
		}
	}
}


export default combineReducers(reduces)