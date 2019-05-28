import { Task } from './task.model';

export class Project {
    constructor() {
        this.title = '';
        this.description = '';
        this.tasks = [];
        this.date = 0;
        this.closed = false;
    }

    title: string;
    description: string;
    tasks: Task[];
    date: number;
    closed: boolean;
    selected?: boolean;
    id?: string;
}
