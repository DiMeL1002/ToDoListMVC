class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.on('add', event => this.addTask(event));
        view.on('toggle', event => this.toggleTask(event));
        view.on('edit', event => this.editTask(event));
        view.on('remove', event => this.removeTask(event));

        view.show(model.taskList);
    }

    addTask(title) {
        const task = this.model.addTask({
            id: Date.now(),
            title,
            completed: false
        });

        this.view.addTask(task);
    }

    toggleTask({ id, isCompleted }) {
        const task = this.model.editTask(id, { isCompleted });

        this.view.toggleTask(task);
    }

    editTask({ id, title }) {
        const task = this.model.editTask(id, { title });

        this.view.editTask(task);
    }

    removeTask(id) {
        this.model.removeTask(id);
        this.view.removeTask(id);
    }
}

export default Controller;