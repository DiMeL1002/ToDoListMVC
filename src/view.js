import { createElement, EventEmitter } from './helpers.js';

class View  extends EventEmitter {
    constructor() {
        super();
        this.form = document.querySelector('.todo__form');
        this.input = document.querySelector('.todo__input');
        this.list = document.querySelector('.todo__list');

        this.form.addEventListener('submit', event => this.handleAdd(event));
    }

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

    addEventListeners(listItem) {
        let checkbox = listItem.querySelector('.task__checkbox');
        let editButton = listItem.querySelector('.task__button-edit');
        let deleteButton = listItem.querySelector('.task__button-delete');

        checkbox.addEventListener('change', event => this.handleToggle(event));
        editButton.addEventListener('click', event => this.handleEdit(event));
        deleteButton.addEventListener('click', event => this.handleRemove(event));

        return listItem;
    }

    handleAdd(event) {
        event.preventDefault();

        if (!this.input.value) return alert('Необходимо ввести название задачи');

        let value = this.input.value;

        this.emit('add', value);
    }

    handleToggle(event) {
        let listItem = event.target.parentNode;
        let id = listItem.getAttribute('data-id');
        let isCompleted = event.target.checked;

        this.emit('toggle', { id, isCompleted });
    }

    handleEdit(event) {
        let listItem = event.target.parentNode;
        let id = listItem.getAttribute('data-id');
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

    handleRemove(event) {
        let listItem = event.target.parentNode;
        let id = listItem.getAttribute('data-id');

        this.emit('remove', id);
    }

    show(taskList) {
        taskList.forEach(task => {
            let listItem = this.createTask(task);

            this.list.appendChild(listItem);
        });
    }

    findTask(id) {
        return this.list.querySelector(`[data-id="${id}"]`);
    }

    addTask(task) {
        let listItem = this.createTask(task);

        this.input.value = '';
        this.list.appendChild(listItem);
    }

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

    editTask(task) {
        let listItem = this.findTask(task.id);
        let label = listItem.querySelector('.task__title');
        let editButton = listItem.querySelector('.task__button-edit');

        label.textContent = task.title;
        editButton.textContent = 'Изменить';
        listItem.classList.remove('task_editing')
    }

    removeTask(id) {
        let listItem = this.findTask(id);

        this.list.removeChild(listItem);
    }
}

export default View;