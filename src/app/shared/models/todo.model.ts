export class Todo {
    constructor() {
        this.todos = [];
        this.doneTodos = [];
    }

    todos: string[];
    doneTodos: string[];
    id?: string;
}