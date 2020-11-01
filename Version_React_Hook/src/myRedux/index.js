/**
 * 合并多个 reducers
 * @method combineReducers
 * @params { Object } reduces 数据列表
 * @return { Function } reducer 方法
 */
export const combineReducers = (reduces) => {
	return function reducer(state, action) {

		// 更改的数据集
		const changed = {}

		// 通过遍历执行 reduces 所有的方法, 并且把返回的新值存储起来
		for (let key in reduces) {
			changed[key] = reduces[key](state[key], action)
		}

		// 将更改的数据集合和原来的数据返回出去
		return {
			...state,
			...changed
		}

	}
}

/**
 * 根据生成的actionType绑定对应的行为方法
 * @method bindActionCreators
 * @params { Object } actionCreators 生成操作行为集合
 * @params { Function } dispatch 派遣方法
 * @return { Object } actions 行为方法
 */
export const bindActionCreators = (actionCreators, dispatch) => {
	// 最终生成的行为方法
	const resultAction = {}

	// 遍历操作生成器，
	for (let key in actionCreators) {
		resultAction[key] = function (...args) {
			// 根据是生成器，生成真正的 action
			const action = actionCreators[key]

			// 执行方法
			dispatch(action(...args))
		}
	}


	return resultAction
}

