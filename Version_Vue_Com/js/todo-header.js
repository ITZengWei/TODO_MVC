;(function () {
	const template = `
		<header class="header">
			<h1>todos</h1>
			<input class="new-todo" placeholder="What needs to be done?" @keydown.enter="getVal" v-auto-focus>
		</header>
`

	const todoHeader = {
		template,
		data() {
			return {

			}
		},
		methods: {
			/* 获取用户输入的信息 */
			getVal(e) {
				let target = e.target
				let val = target.value.trim()
				if (!val.length) return
				console.log(val)

				this.$emit('handle-add', val)
				target.value = ''
			}
		},
		directives: {
			autoFocus: {
				inserted(ele) {
					console.log(ele)
					ele.focus()
				}
			}
		}
	}

	window.todoHeader = todoHeader

}())
