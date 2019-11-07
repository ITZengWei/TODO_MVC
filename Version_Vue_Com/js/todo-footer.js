;(function () {
	const template = `
		<footer class="footer">
			<!-- This should be \`0 items left\` by default -->
			<span class="todo-count"><strong>{{ taskCount }}</strong> item left</span>
			<!-- Remove this if you don't implement routing -->
			<ul class="filters">
				<li>
					<a class="selected" href="#/">All</a>
				</li>
				<li>
					<a href="#/active">Active</a>
				</li>
				<li>
					<a href="#/completed">Completed</a>
				</li>
			</ul>
			<!-- Hidden if no completed items are left ↓ -->
			<button class="clear-completed" @click="removeAll">Clear completed</button>
		</footer>
`
	const todoFooter = {
		template,
		data() {
			return {
				filterText: ''
			}
		},
		methods: {
			removeAll (){
				this.$emit('handle-empty')
			}
		},
		created() {
			window.onhashchange = (e) => {
				let router = document.location.hash.substr(2)
				if (this.filterText === router) return
				this.filterText = router
				this.$emit('handle-router', this.filterText)
			}
		},
		props: ['task-count']
	}

	window.todoFooter = todoFooter

}())
