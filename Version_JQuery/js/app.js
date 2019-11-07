;(function ($) {
	/* 1、处理  列表 展示  (有数据 和 无数据) */
	/* 2、处理  添加功能 删除功能 */
	/* 3、处理  切换联动效果  */
	/* 4、处理  双击编辑效果 */
	/* 5、处理  底部 切换路由效果 */

	/* 添加输入框 */
	const $addInput = $('.new-todo')
	/* 切换按钮 所有选中 */
	const $toggleAll = $('#toggle-all')
	/* 列表容器盒子 */
	const $listWra = $('.todo-list')



	/* 还有多少个没有完成 */
	const $taskCount = $('.task-count')

	/* 清空所有完成项目 */
	const $clearComplated = $('.clear-completed')


	const obj = {
		/* 数据列表 */
		todos: JSON.parse(window.localStorage.getItem('jQueryTODO') || '[]'),
		/* 过滤路由文本 */
		filterRouterText: '',
		/* 列表渲染 */
		listRender(filterData) {

			/* 如果长度为 0 我们就隐藏 */
			this.showPage()

			$listWra .html('')
			filterData.forEach(item => {
				/* 生产一个 todo 字符串*/
				const template = this.return_todo(item)
				/* 加入到 列表容器中 */
				$(template).appendTo($listWra)
			})
			$taskCount.text(this.computedNoComp())

		},
		/* 绑定事件函数 */
		bindEvent() {
			const self = this

			/* 开始 input 自动获取焦点 */
			self.setCaretPosition($addInput.get(0), 0)

			/* 处理路由 */
			window.onhashchange = function () {
				const nowHash = document.location.hash.substr(2)
				/* 如果和之前一样 我们就直接退出 */
				if (self.filterRouterText === nowHash) return
				self.filterRouterText = nowHash
				/* 临时显示数据 */
				const templateData = self.handleFilterData()
				/* 渲染页面 */
				self.listRender(templateData)
			}

			/* 处理添加 */
			$addInput.on('keydown', function (e) {
				/* 如果按下的键码不是 回车我们就退出 */
				if (e.keyCode !== 13) return
				/* 如果没有输入内容我们也退出 */
				const val = this.value.trim()
				if (!val.length) return
				const newTodo = {
					/* 如果 TODOS 有内容 我们就设置 最后要给 ID + 1 反之 为 1 */
					id: self.todos.length ? self.todos[ self.todos.length - 1 ].id + 1 : 1,
					value: val,
					completed: false
				}
				/* 加入 列表项目 */
				$(self.return_todo(newTodo)).appendTo($listWra)
				self.todos.push(newTodo)

				self.showPage()

				/* 清空内容 */
				this.value = ''
			})

			/* 处理删除功能 */
			$listWra.on('click', '.destroy', function () {
				const parentLi = $(this).closest('li')
				const removeId = parentLi.data('id')

				/* 删除当前列表 并且修改数据 并且删除事件 */
				parentLi.remove()
				self.todos = self.todos.filter(item => item.id !== removeId)

				self.showPage()
			})

			/* 处理删除 所有完成的 列表 */
			/* TODO */
			$clearComplated.on('click', function () {
				self.todos = self.todos.filter(item => !item.completed)
				self.listRender(self.todos)

				self.showPage()
			})

			/* 处理样式联动 */
			$listWra.on('click', '.toggle', function () {
				/* 通过寻找 li  找到对应的 id */
				const parentLi = $(this).closest('li')
				const linkageId = parentLi.data('id')
				/* 找到要修改的 的那一项 修改数据 */
				const completed = $(this).prop('checked')
				const changeItem = self.todos.find(item => item.id === linkageId)
				changeItem.completed = completed
				console.log(changeItem)
				/* 改变样式 */
				completed ? parentLi.addClass('completed') : parentLi.removeClass('completed')
				let num = self.computedNoComp()
				$taskCount.text(num)
				$toggleAll.prop('checked', num === 0)
			})

			/* 切换所有样式 */
			$toggleAll.on('click', function () {
				const flag = $(this).prop('checked')
				if (flag) {
					self.todos.forEach(item => item.completed = true)
					$listWra.find('li').addClass('completed').find('.toggle').prop('checked', true)
					$taskCount.text(self.computedNoComp())
				} else {
					self.todos.forEach(item => item.completed = false)
					$listWra.find('li').removeClass('completed').find('.toggle').prop('checked', false)
					$taskCount.text(self.computedNoComp())
				}
			})

			/* 处理双击编辑 */
			$listWra.on('dblclick', 'label', function () {
				const parentLi = $(this).closest('li')

				/* 获取焦点 */
				const $editInput = parentLi.find('.edit')

				/* 获取新的 值 */
				const oldVal = $editInput.val()

				/* 设置光标 */
				self.setCaretPosition($editInput.get(0), oldVal.length)

				parentLi.addClass('editing')

				$editInput.one('blur', function (e) {
					/* 处理编辑问题 */
					self.handleEdit($editInput, oldVal, parentLi)
				})

				/* 注册 回车按钮功能 */
				$editInput.one('keydown', function (e) {
					/* 不是回车我们取消 */
					if (e.keyCode !== 13) return
					/* 处理编辑问题 */
					self.handleEdit($editInput, oldVal, parentLi)
				})
				/* 注册 全局 ESC 事件 */
				$(document).one('keydown', function (e) {
					/* 不是 ESC 我们就不处理 */
					if (e.keyCode !== 27) return
					/* 取消本次编辑 */
					parentLi.removeClass('editing')
				})
			})

		},
		/* 生产 新的TODO String */
		return_todo(item) {
			return `
				<li class="${ item.completed ? 'completed' : '' }" data-id="${ item.id }">
					<div class="view">
						<input class="toggle" type="checkbox" ${ item.completed ? 'checked' : '' }>
						<label>${ item.value }</label>
						<button class="destroy"></button>
					</div>
					<input class="edit" value="${ item.value }">
				</li>	
				`
		},
		/* 设置光标为 input 最后面 */
		setCaretPosition(tObj, sPos) {
			if(tObj.setSelectionRange){
				setTimeout(function(){
					tObj.setSelectionRange(sPos, sPos);
					tObj.focus();
				}, 0);
			}else if(tObj.createTextRange){
				var rng = tObj.createTextRange();
				rng.move('character', sPos);
				rng.select();
			}
		},
		/* 处理编辑 */
		handleEdit(origin, oldVal, target) {
			const nowVal = origin.val().trim()
			/* 取消编辑状态 */
			target.removeClass('editing')

			/* 两次编辑内容相同不做 过多的处理 */
			if (nowVal === oldVal) return

			/* 处理的 ID */
			const editId = target.data('id')

			/* 当前那一项 */
			const index = this.todos.findIndex(item => item.id === editId)

			if (!nowVal.length) {
				/* 删除 */
				this.todos.splice(index, 1)
				target.remove()
			} else {
				/* 替换 */
				this.todos[index].value = nowVal
				target.find('label').text(nowVal)
			}
		},
		/* 处理过滤显示数据 */
		handleFilterData() {
				switch (this.filterRouterText) {
				case 'active':
					return this.todos.filter(item => !item.completed)
					break
				case 'completed':
					return this.todos.filter(item => item.completed)
					break
				default: return this.todos
			}
		},
		/* 计算 还有多少没有完成 */
		computedNoComp() {
			return this.todos.filter(item => !item.completed).length
		},
		/* 设置根据 TODO list 判断 底部 和 main 区域是否显示 页面 */
		showPage() {
			/* 判断长度 决定是否存在 或者 不存在 */
			const wra = $('.main, .footer')
			console.log(this.todos.length)
			this.todos.length ? wra.show() : wra.hide()


			window.localStorage.setItem('jQueryTODO', JSON.stringify(this.todos))
		},
		init() {
			/* 开始渲染页面 */
			this.listRender(this.todos)
			/* 绑定事件 */
			this.bindEvent()
			/* 添加输入框自动获取焦点 */
			window.todos = this.todos
		}
	}
	/* 启动 */
	obj.init()
})(jQuery);
