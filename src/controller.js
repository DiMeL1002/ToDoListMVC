/** Класс представляющий контроллер. */
class Controller {
    /**
     * Создает контроллер.
     * @param {Object} model Объект модели.
     * @param {Object} view Объект представления.
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.on('add', event => this.addTask(event));
        view.on('toggle', event => this.toggleTask(event));
        view.on('edit', event => this.editTask(event));
        view.on('remove', event => this.removeTask(event));

        view.show(model.taskList);
    }

    /**
     * Добавить задачу.
     * @param {string} title Заголовок задачи.
     */
    addTask(title) {
        const task = this.model.addTask({
            id: Date.now(),
            title,
            completed: false
        });

        this.view.addTask(task);
    }

    /**
     * Переключить состояние задачи.
     * @param {Object} param0 Параметры задачи.
     * @param {number} param0.id ID задачи.
     * @param {boolean} param0.isCompleted Состояние задачи.
     */
    toggleTask({ id, isCompleted }) {
        const task = this.model.editTask(id, { isCompleted });

        this.view.toggleTask(task);
    }

    /**
     * Редактировать задачу.
     * @param {Object} param0 Параметры задачи.
     * @param {number} param0.id ID задачи.
     * @param {string} param0.title Заголовок задачи.
     */
    editTask({ id, title }) {
        const task = this.model.editTask(id, { title });

        this.view.editTask(task);
    }

    /**
     * Удалить задачу.
     * @param {number} id ID задачи.
     */
    removeTask(id) {
        this.model.removeTask(id);
        this.view.removeTask(id);
    }
}

export default Controller;