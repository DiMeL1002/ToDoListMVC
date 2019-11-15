/**
 * Создает DOM элемент.
 * @param {string} tag Имя тега.
 * @param {Object} props Свойства DOM элемента.
 * @param  {...any} children Дочерние элементы DOM элемента
 */
function createElement(tag, props, ...children) {
    const element = document.createElement(tag);

    Object.keys(props).forEach(key => {
        if (key.startsWith('data-')) {
            element.setAttribute(key, props[key]);
        } else {
            element[key] = props[key];
        }
    });

    children.forEach(child => {
        if (typeof child === 'string') {
            child = document.createTextNode(child);
        }

        element.appendChild(child);
    });

    return element;
}

/** Класс представляющий источник событий. */
class EventEmitter {
    constructor() {
        /** 
         * @param {Object} events Список событий.
         * @example
         * this.events = {add: callback}
         */
        this.events = {};
    }

    /**
     * Добавить событие.
     * @param {string} type Название события.
     * @param {Function} callback Обработчик события.
     */
    on(type, callback) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(callback);
    }

    /**
     * Вызвать событие.
     * @param {string} type Название события.
     * @param {*} arg Аргументы обработчика события.
     */
    emit(type, arg) {
        if (this.events[type]) {
            this.events[type].forEach(callback => callback(arg));
        }
    }
}

/**
 * Сохранить список задач в localStorage.
 * @param {*} data Список задач.
 */
function save(data) {
    const string = JSON.stringify(data);

    localStorage.setItem('taskList', string);
}

/**
 * Загрузить список задач из localStorage.
 */
function load() {
    const string = localStorage.getItem('taskList');
    const data = JSON.parse(string);
    
    return data;
}

export { createElement, EventEmitter, save, load, };