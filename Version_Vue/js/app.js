;(function () {
	const vm = new Vue({
		data: {
			/* 任务列表 */
			todos: JSON.parse(window.localStorage.getItem('newTODO') || '[]'),
			/* 当前展示列表 all  completed no-completed */
			currentShow: '',
			/* 只能有一个编辑  */
			currentEdit: ''
		},
		created() {
			window.onhashchange = () => {
				let currHash = document.location.hash.substr(2)
				this.currentShow = currHash
				console.log(this.currentShow)
			}
		},
		methods: {
			/* 处理点击添加 */
			handleEnterAdd(e) {
				let ele = e.target
				let val = ele.value.trim()
				if (!val.length) return
				let newId = this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 1
				this.todos.push({ id: newId, todo: val, completed: false })
				/* 清空输入框 */
				ele.value = ''
			},
			/* 处理点击删除 */
			handleClickRemove(id) {
				let index = this.todos.findIndex(item => item.id === id)
				this.todos.splice(index, 1)
			},
			/* 处理清空所有完成的列表 */
			handleClickDelAll() {
				this.todos = this.todos.filter(item => !item.completed)
			},
			/* 处理点击编辑 */
			handleClickEdit(item) {
				console.log('编辑了')
				this.currentEdit = item
			},
			/* 保存编辑 */
			saveEdit(item, e) {
				let target = e.target
				let val = target.value.trim()
				/* 如果值为 空 我们就删除 */
				if (!val.length) {
					this.todos = this.todos.filter(list => list !== item)
				} else {
					/* 否者就覆盖 */
					item.todo = target.value
				}
				this.currentEdit = ''
			},
			/* 结束编辑 */
			overEdit() {
				return this.currentEdit = ''
			}
		},
		computed: {
			/* 计算还有多少没有完成 */
			todoCount() {
				return this.todos.filter(item => !item.completed).length
			},
			/* 过滤 路由 */
			filterTODOS() {
				switch (this.currentShow) {
					case  'active' :
						return this.todos.filter(item => !item.completed)
						break
					case 'completed' :
						return this.todos.filter(item => item.completed)
						break
					default:
						return this.todos
				}
			},
			/* 切换 所有 */
			toggleAll: {
				get() {
					return this.todos.every(item => item.completed)
				},
				set(val) {
					this.todos.forEach(item => item.completed = val)
				}
			}
		},
		directives: {
			autoFocus: {
				inserted(ele) {
					ele.focus()
				}
			},
			editFocus(ele, binding) {
				if (binding.value) {
					ele.focus()
				}
			}
		},
		watch: {
			todos: {
				deep: true,
				handler() {
					let dataStr = JSON.stringify(this.todos)
					window.localStorage.setItem('newTODO', dataStr)
				}
			}
		}
	}).$mount('#app')

}())
