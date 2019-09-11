import { EventEmitter } from './helpers.js';

class Model  extends EventEmitter{
    constructor(taskList = []) {
        super();

        if (taskList === null) {
            taskList = [];
        }
        
        this.taskList = taskList;
    }

    getTask(id) {
        return this.taskList.find(task => task.id == id);
    }

    addTask(task) {
        this.taskList.push(task);
        this.emit('change', this.taskList);

        return task;
    }

    editTask(id, data) {
        let task = this.getTask(id);

        Object.keys(data).forEach(prop => task[prop] = data[prop]);

        this.emit('change', this.taskList);

        return task;
    }

    removeTask(id) {
        let taskIndex = this.taskList.findIndex(task => task.id == id);

        if (taskIndex > -1) {
            this.taskList.splice(taskIndex, 1);
            this.emit('change', this.taskList);
        }
    }
}

export default Model;