import {
	ACTION_SET_TODO,
	ACTION_TOGGLE_TODO,
	ACTION_TOGGLE_ALL_TODO,
	ACTION_ADD_TODO,
	ACTION_REMOVE_TODO,
	ACTION_CLEAR_COMPLETED_TODO,
	ACTION_EDIT_TODO,

} from './actionTypes'

/**
 * 创建 初始化设置待办 actionType
 * @method createToggle
 * @param { Array } newTodoList 新的待办
 * @return { Object } actionType 操作类型
 */
export const createSet = (newTodoList) => {
	return {
		type: ACTION_SET_TODO,
		payload: newTodoList
	}
}


/**
 * 创建 切换待办完成状态 actionType
 * @method createToggle
 * @param { Number } id 切换的待办 id
 * @return { Object } actionType 操作类型
 */
export const createToggle = (id) => {
	return {
		type: ACTION_TOGGLE_TODO,
		payload: id
	}
}
/**
 * 创建 切换所有待办完成状态 actionType
 * @method createToggleAll
 * @param { Boolean } completed 待切换的状态
 * @return { Object } actionType 操作类型
 */
export const createToggleAll = (completed) => {
	return (dispatch, getState) => {
		const { todoList } = getState()

		dispatch({
			type: ACTION_TOGGLE_ALL_TODO,
			payload: todoList.map(item => {
				return { ...item, completed }
			})
		})
	}
}

/**
 * 创建 添加待办 actionType
 * @method createAdd
 * @param { String } text 新的待办文案
 * @return { Object } actionType 操作类型
 */
export const createAdd = (text) => {
	return (dispatch, getState) => {
		// 判断是否已经存在了这个待办
		const { todoList } = getState()

		if (todoList.find(todo => todo.text === text)) {
			alert(`您好，已经有"${ text }"这个待办~`)
			return
		}

		dispatch({
			type: ACTION_ADD_TODO,
			payload: text
		})
	}
}

/**
 * 创建 删除待办 actionType
 * @method createRemove
 * @param { Number } id 删除待办的id
 * @return { Object } actionType 操作类型
 */
export const createRemove = (id) => {
	return {
		type: ACTION_REMOVE_TODO,
		payload: id
	}
}

/**
 * 创建 清空完成待办 actionType
 * @method createRemove
 * @return { Object } actionType 操作类型
 */
export const createClearCompleted = () => {
	return {
		type: ACTION_CLEAR_COMPLETED_TODO,
		payload: null
	}
}

/**
 * 创建 编辑待办 actionType
 * @method createEdit
 * @param { Number } id 编辑待办的 id
 * @param { String } text 新编辑待办的文本
 * @return { Object } actionType 操作类型
 */
export const createEdit = (id, text) => {
	return {
		type: ACTION_EDIT_TODO,
		payload: { id, text }
	}
}