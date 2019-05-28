import { Task } from './task.model';

export class ActiveTask extends Task{
    date: number;
    projectId?: string;
}