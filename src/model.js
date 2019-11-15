import { EventEmitter } from './helpers.js';

/**
 * Класс представляющий модель.
 * @extends EventEmitter
 */
class Model extends EventEmitter{
    /**
     * Создает модель.
     * @param {Object[]} taskList Список задач.
     * @param {number} taskList[].id ID задачи.
     * @param {string} taskList[].title Заголовок задачи.
     * @param {boolean} taskList[].completed Состояние задачи.
     */
    constructor(taskList = []) {
        super();

        if (taskList === null) {
            taskList = [];
        }
        
        this.taskList = taskList;
    }

    /**
     * Получить задачу.
     * @param {number} id ID задачи.
     * @returns {Object} Объект задачи.
     */
    getTask(id) {
        return this.taskList.find(task => task.id == id);
    }

    /**
     * Добавить задачу.
     * @param {Object} task Объект задачи.
     * @param {number} task.id ID задачи.
     * @param {string} task.title Заголовок задачи.
     * @param {boolean} task.completed Состояние задачи.
     * @returns {Object} Объект задачи.
     */
    addTask(task) {
        this.taskList.push(task);
        this.emit('change', this.taskList);

        return task;
    }

    /**
     * Редактировать задачу.
     * @param {number} id ID задачи.
     * @param {Object} data Объект задачи.
     * @returns {Object} Объект задачи.
     */
    editTask(id, data) {
        let task = this.getTask(id);

        Object.keys(data).forEach(prop => task[prop] = data[prop]);

        this.emit('change', this.taskList);

        return task;
    }

    /**
     * Удалить задачу.
     * @param {number} id ID задачи.
     */
    removeTask(id) {
        let taskIndex = this.taskList.findIndex(task => task.id == id);

        if (taskIndex > -1) {
            this.taskList.splice(taskIndex, 1);
            this.emit('change', this.taskList);
        }
    }
}

export default Model;