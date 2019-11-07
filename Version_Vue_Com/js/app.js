;(function (window) {
	const vm = new Vue({
		el: '#app',
		data: {
			todos: JSON.parse(window.localStorage.getItem('newTodos') ||  '[]'),
			routerText: ''
		},
		methods: {
			/* 添加列表 */
			addTodoList(val) {
				let newTodo = {
					id: this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 1,
					val,
					completed: false
				}
				this.todos.push(newTodo)
			},
			/* 删除列表 */
			removeTodoList(id) {
				this.todos = this.todos.filter(item => item.id !== id)
			},
			/* 删错所有 */
			removeTodoAll() {
				this.todos = this.todos.filter(item => !item.completed)
			},
			/* 改变所有 */
			changeAll(flag) {
				this.todos.forEach(item => item.completed = !flag)
			},
			/* 改变列表 */
			changeTodoList(info) {
				info[1].val = info[0]
			},
			/* 改变路由 */
			changeRouter(router) {
				this.routerText = router
			}
		},
		components: {
			todoHeader,
			todoList,
			todoFooter,
			foot
		},
		computed: {
			/* 获取未完成的数量 */
			taskCount() {
				return this.todos.filter(item => !item.completed).length
			},
			/* 显示的列表 */
			showTodos() {
				switch (this.routerText) {
					case 'active':
						return this.todos.filter(item => !item.completed)
						break
					case 'completed':
						return this.todos.filter(item => item.completed)
						break
					default: return this.todos
				}
			}
		},
		watch: {
			'todos': {
				handler: function () {
					window.localStorage.setItem('newTodos', JSON.stringify(this.todos))
				},
				deep: true,
			}
		}
	})


	/* 怎么解决 小写的 问题 taskCount */
})(window);
