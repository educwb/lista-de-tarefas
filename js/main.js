
const Main = {

  currentTasks: [],

  init: function () {
    this.cacheSelectors()
    this.bindEvents()
    this.getStoraged()
    this.buildTasks()
    // console.log(this.currentTasks)
  },

  cacheSelectors: function(){
    this.$checkButtons = document.querySelectorAll('.check')
    this.$inputTask = document.querySelector('#inputTask')
    this.$list = document.querySelector('#list')
    this.$removeButtons = document.querySelectorAll('.remove')
  },

  bindEvents: function () {
    const self = this;

    this.$checkButtons.forEach(function(button) {
      button.onclick = self.Events.checkButton_click.bind(self)
    })

    // .bind(this) para que a chamada reconheça o this correto
    // levar o 'this' de fora, para dentro da função
    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

    // nessa situação, não pode ser '.bind(this)' porque se refere
    // ao escopo da função que está dentro do forEach.
    // Então usaremos .bind(self) para levar o 'this' do bindEvents.
    this.$removeButtons.forEach(function(button) {
      button.onclick = self.Events.removeButton_click.bind(self)
    })
  },

  getStoraged: function() {
    const storagedTasks = localStorage.getItem('tasks')

    if (storagedTasks) {
      this.currentTasks = JSON.parse(storagedTasks)
    } else {
      localStorage.setItem('tasks', JSON.stringify([]))
    }

  },

  // DESAFIO - salvar no local storage se a tarefa está feita
  // adicionado parâmetro 'isDone' para ser retornado na
  // 'li' como 'data-task'
  getTaskHtml: function(paramTask, isDone) {
    return `
      <li class="${isDone ? 'done' : ''}" data-task="${paramTask}">
        <div class="check"></div>
        <label class="task">
          ${paramTask}
        </label>
        <button class="remove" data-task="${paramTask}"></button>
      </li>
    `

  },

  // DESAFIO - salvar no local storage se a tarefa está feita
  // criado a função insertHTML para reaproveitar código
  insertHTML: function (element, htmlString) {
    element.innerHTML += htmlString

    /* chamar novamente as funções abaixo
        porque quando é usado o innerHTML
        os seletores são perdidos e é
        necessário chamá-los novamente
    */
    this.cacheSelectors()
    this.bindEvents()
  },

  // DESAFIO - salvar no local storage se a tarefa está feita
  // alterado para recuperar a propriedade 'done'
  // 'getTaskHtml' é chamando passando também 'eachTask.done'
  buildTasks: function () {
    let varHtml = ''

    this.currentTasks.forEach(eachTask => {
      varHtml += this.getTaskHtml(eachTask.task, eachTask.done)
    })

    // função que substitui 'this.$list.innerHTML = varHtml'
    // e a rechamada das funções cacheSelectors e bindEvents
    this.insertHTML(this.$list, varHtml)
  },

  // DESAFIO - salvar no local storage se a tarefa está feita
  // criado 'varValue' para obter o valor passado na 'li'
  // 'changeDone' alterna a propriedade 'done'
  Events: {
    checkButton_click: function (e) {
      const varLi = e.target.parentElement
      const varValue = varLi.dataset['task']
      const isDone = varLi.classList.contains('done')
      
      const changeDone = this.currentTasks.map(eachTask => {

        console.log(eachTask)

        if (eachTask.task === varValue) {
          eachTask.done = !isDone
        }

        return eachTask
      })

      localStorage.setItem('tasks', JSON.stringify(changeDone))

      if (!isDone) {
        return varLi.classList.add('done')
      }

      varLi.classList.remove('done')
    },

    // DESAFIO - salvar no local storage se a tarefa está feita
    // insere o valor da propriedade 'done' na criação da tarefa
    inputTask_keypress: function (e) {
      const varKey = e.key
      const varValue = e.target.value
      const isDone = false

      if (varKey === 'Enter') {
        const taskHTML = this.getTaskHtml(varValue, isDone)

        this.insertHTML(this.$list, taskHTML)

        e.target.value = ''

        const savedTasks = localStorage.getItem('tasks')
        const savedTasksObject = JSON.parse(savedTasks)

        const arrayTasks = [
          { task: varValue, done: isDone },
          ...savedTasksObject,
        ]

        const jsonTasks = JSON.stringify(arrayTasks)

        console.log(this.currentTasks)

        this.currentTasks = arrayTasks

        localStorage.setItem('tasks', jsonTasks)
      }

    },

    removeButton_click: function (e) {
      const varLi = e.target.parentElement
      const valueToRemove = e.target.dataset['task']

      // console.log(e.target.dataset['task'])

      const tasksRemained = this.currentTasks.filter(
        eachTask => eachTask.task !== valueToRemove
      )

      // console.log(tasksRemained)
      // console.log(this.currentTasks)

      localStorage.setItem('tasks', JSON.stringify(tasksRemained))
      this.currentTasks = tasksRemained

      varLi.classList.add('removed')
      
      setTimeout(function () {
        varLi.classList.add('hidden')
      }, 300)
    }
  }

}

Main.init()