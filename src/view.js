import { createElement, EventEmitter } from './helpers.js';

/**
 * Класс представляющий представление.
 * @extends EventEmitter
 */
class View extends EventEmitter {
    constructor() {
        super();
        this.form = document.querySelector('.todo__form');
        this.input = document.querySelector('.todo__input');
        this.list = document.querySelector('.todo__list');

        this.form.addEventListener('submit', event => this.handleAdd(event));
    }

    /**
     * Создать задачу. Возвращает результат вызова метода addEventListeners.
     * @param {Object} task Объект задачи. 
     * @param {string} task.id ID задачи.
     * @param {string} task.title Заголовок задачи.
     * @param {boolean} task.completed Состояние задачи.
     */
    createTask(task) {
        let checkbox = createElement(
            'input',
            {
                type: 'checkbox',
                className: 'task__checkbox',
                checked: task.completed ? 'checked' : ''
            }
        );
        let label = createElement('span', { className: 'task__title' }, task.title);
        let editInput = createElement('input', { className: 'task__textfield' });
        let editButton = createElement('button', { className: 'task__button-edit' }, 'Изменить');
        let deleteButton = createElement('button', { className: 'task__button-delete' }, 'Удалить');
        let listItem = createElement(
            'li',
            {
                className: `task${task.completed ? ' task_completed' : ''}`,
                'data-id': task.id
            },
            checkbox, label, editInput, editButton, deleteButton
        )

        return this.addEventListeners(listItem);
    }

    /**
     * Добавляет обработчики событий DOM элементу.
     * @param {Object} listItem DOM элемент.
     * @returns {Object} DOM элемент.
     */
    addEventListeners(listItem) {
        let checkbox = listItem.querySelector('.task__checkbox');
        let editButton = listItem.querySelector('.task__button-edit');
        let deleteButton = listItem.querySelector('.task__button-delete');

        checkbox.addEventListener('change', event => this.handleToggle(event));
        editButton.addEventListener('click', event => this.handleEdit(event));
        deleteButton.addEventListener('click', event => this.handleRemove(event));

        return listItem;
    }

    /**
     * Инициирует добавление задачи.
     * @param {Object} event Объект события.
     */
    handleAdd(event) {
        event.preventDefault();

        if (!this.input.value) return alert('Необходимо ввести название задачи');

        let value = this.input.value;

        this.emit('add', value);
    }

    /**
     * Инициирует изменение статуса задачи.
     * @param {Object} event Объект события.
     */
    handleToggle(event) {
        let listItem = event.target.parentNode;
        let id = parseInt(listItem.getAttribute('data-id'));
        let isCompleted = event.target.checked;

        this.emit('toggle', { id, isCompleted });
    }

    /**
     * Инициирует редактирование задачи.
     * @param {Object} event Объект события.
     */
    handleEdit(event) {
        let listItem = event.target.parentNode;
        let id = parseInt(listItem.getAttribute('data-id'));
        let label = listItem.querySelector('.task__title');
        let input = listItem.querySelector('.task__textfield');
        let editButton = listItem.querySelector('.task__button-edit');
        let title = input.value;
        let isEditing = listItem.classList.contains('task_editing');

        if (isEditing) {
            this.emit('edit', { id, title });
        }
        else {
            input.value = label.textContent;
            editButton.textContent = 'Сохранить';
            listItem.classList.add('task_editing');
        }
    }

    /**
     * Инициирует удаление задачи.
     * @param {Object} event Объект события.
     */
    handleRemove(event) {
        let listItem = event.target.parentNode;
        let id = parseInt(listItem.getAttribute('data-id'));

        this.emit('remove', id);
    }

    /**
     * Распечатывает список задач.
     * @param {Object[]} taskList Список задач.
     * @param {number} taskList[].id ID задачи.
     * @param {string} taskList[].title Заголовок задачи.
     * @param {boolean} taskList[].completed Состояние задачи.
     */
    show(taskList) {
        taskList.forEach(task => {
            let listItem = this.createTask(task);

            this.list.appendChild(listItem);
        });
    }

    /**
     * Находит задачу по ID.
     * @param {number} id ID задачи.
     * @returns {Object} Объект задачи.
     */
    findTask(id) {
        return this.list.querySelector(`[data-id="${id}"]`);
    }

    /**
     * Добавляет задачу.
     * @param {Object} task Объект задачи.
     * @param {number} task.id ID задачи.
     * @param {string} task.title Заголовок задачи.
     * @param {boolean} task.isCompleted Состояние задачи.
     */
    addTask(task) {
        let listItem = this.createTask(task);

        this.input.value = '';
        this.list.appendChild(listItem);
    }

    /**
     * Изменяет состояние задачи.
     * @param {Object} task Объект задачи.
     * @param {number} task.id ID задачи.
     * @param {string} task.title Заголовок задачи.
     * @param {boolean} task.isCompleted Состояние задачи.
     */
    toggleTask(task) {
        let listItem = this.findTask(task.id);
        let checkbox = listItem.querySelector('.task__checkbox');

        checkbox.checked = task.isCompleted;

        if (task.isCompleted) {
            listItem.classList.add('task_completed');
        } else {
            listItem.classList.remove('task_completed');
        }
    }

    /**
     * Редактирует задачу.
     * @param {Object} task Объект задачи.
     * @param {number} task.id ID задачи.
     * @param {string} task.title Заголовок задачи.
     * @param {boolean} task.isCompleted Состояние задачи.
     */
    editTask(task) {
        let listItem = this.findTask(task.id);
        let label = listItem.querySelector('.task__title');
        let editButton = listItem.querySelector('.task__button-edit');

        label.textContent = task.title;
        editButton.textContent = 'Изменить';
        listItem.classList.remove('task_editing')
    }

    /**
     * Удаляет задачу.
     * @param {number} id ID задачи.
     */
    removeTask(id) {
        let listItem = this.findTask(id);

        this.list.removeChild(listItem);
    }
}

export default View;