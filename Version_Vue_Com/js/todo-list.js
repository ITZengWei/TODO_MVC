;(function () {
	const template = `
		<section class="main">
			<input id="toggle-all" class="toggle-all" type="checkbox" v-model="isSwitch">
			<label for="toggle-all">Mark all as complete</label>
			<ul class="todo-list">
				<!-- These are here just to show the structure of the list items -->
				<!-- List items should get the class \`editing\` when editing and \`completed\` when marked as completed -->
				<li v-for="list in todos" :class="{ completed: list.completed, editing: currentEdit === list }">
					<div class="view" >
						<input class="toggle" type="checkbox" v-model="list.completed">
						<label @dblclick="handleClickChange(list)">{{ list.val }}</label>
						<button class="destroy" @click="getId(list.id)"></button>
					</div>
					<input class="edit" :value="list.val" v-edit-focus="currentEdit === list"
					@keydown.enter="getNewVal(list, $event)" @blur="getNewVal(list, $event)">
				</li>
	
			</ul>
		</section>
`

	const todoList = {
		template,
		data() {
			return {
				/* 当前编辑项 */
				currentEdit: ''
			}
		},
		methods: {
			getId(val) {
				console.log(val)
				this.$emit('handle-remove', val)
			},
			handleClickChange(item) {
				this.currentEdit = item
			},
			/* 获取新的值 */
			getNewVal(list, e) {
				let target = e.target
				let val = target.value
				if (!val.length) return
				this.$emit('handle-change-list', [val, list])
				this.currentEdit = ''

			}
		},
		props: ['todos'],
		computed: {
			'isSwitch': {
				get() {
					console.log(this.todos.every(item => item.completed))
					return this.todos.every(item => item.completed)
				},
				set() {
					console.log(this.isSwitch)
					this.$emit('handle-change', this.isSwitch)
				}
			}
		},
		directives: {
			editFocus(ele, binding) {
				/* 如果 值为 false  我们就不 获取焦点 */
				if (!binding.value) return
				ele.focus()
			}
		}
	}

	window.todoList = todoList

}())
