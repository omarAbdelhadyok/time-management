import { Component, OnInit, Input, Output, EventEmitter, Renderer2, OnChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatInput, MatSelect, MatDialog } from '@angular/material';
import * as uuidv1 from 'uuid/v1.js';
import { NgForm } from '@angular/forms';

import { ProjectsService, ObjectsOperationsService } from '../../services';
import { statuses } from '../../services/local/task-statuses';
import { Status, Task, Project } from '../../models';
import { EditTaskComponent } from '../edit-task/edit-task.component';

@Component({
  selector: 'app-projects-viewer',
  templateUrl: './projects-viewer.component.html',
  styleUrls: ['./projects-viewer.component.scss']
})
export class ProjectsViewerComponent implements OnInit {

  @Input() projects: Project[];
  @Output() reset = new EventEmitter();
  @Output() getProjects = new EventEmitter();

  busyAddingNewProjectTask: boolean = false;
  busyClosingProject: boolean = false;
  busyAddingActiveTask: boolean = false;

  statuses: Status = statuses();

  constructor(private projectsService: ProjectsService,
    private toastr: ToastrService,
    private objectsOperationsService: ObjectsOperationsService,
    private renderer: Renderer2,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  addTask(id, task) {
    this.projectsService.addNewTask(id, task).then(res => console.log(res));
  }
  //projects methods
  
  addNewTaskToProject(taskInput: MatInput, durationInput: MatInput, unitSelect: MatSelect, projectCardIndex, loader, projectTaskFrom: NgForm) {
    let project = this.projects[projectCardIndex],
        task = taskInput.value.trim(),
        duration = durationInput.value,
        unit = unitSelect.value;
    if((!duration && unit) || (duration && !unit))
      return this.toastr.warning('To add duration fill both duration and unit');
    if(!task) return this.toastr.error('Please type a valid task');
    if(Number(duration) > 1) unit = unit+'s';
    let newTask: Task = {
      task: task,
      status: this.statuses.holding,
      id: uuidv1(),
      duration,
      unit,
      projectId: project.id
    }
    try {
      this.renderer.setStyle(loader, 'display', 'inline-block');
      this.busyAddingNewProjectTask = true;
      this.projectsService.addNewTask(project.id, newTask)
      .then(res => {
        this.renderer.setStyle(loader, 'display', 'none');
        this.busyAddingNewProjectTask = false;
        this.projects[projectCardIndex].tasks.push(newTask);
        projectTaskFrom.resetForm();
        this.toastr.success('Task was added successfully');
      })
      .catch(err => {
        this.toastr.error('Something went wrong, please try again');
        this.busyAddingNewProjectTask = false;
        this.renderer.setStyle(loader, 'display', 'none');
      })
    } catch (error) {
      this.toastr.error('Something went wrong, please try again');
      this.busyAddingNewProjectTask = false;
      this.renderer.setStyle(loader, 'display', 'none');
    }
  }

  closeProject(projectId) {
    try {
      this.busyClosingProject = true;
      this.projectsService.toggleProject(projectId, true)
      .then(res => {
        this.busyClosingProject = false;
        this.reset.emit();
        this.getProjects.emit();
        this.toastr.success('Project was closed successfully');
      })
      .catch(err => {
        this.toastr.error('Something went wrong, please try again');
        this.busyClosingProject = false;
      })
    } catch (error) {
      this.toastr.error('Something went wrong, please try again');
      this.busyClosingProject = false;
    }
  }

  //addong task to the active setting it in its project as current = true
  addTaskToActive(projectCardI, taskIndex, loader) {
    if(this.projects[projectCardI].tasks[taskIndex].status == this.statuses.completed)
      return this.toastr.error('This task is completed, please select another one');

    if(this.projects[projectCardI].tasks[taskIndex].status == this.statuses.current)
      return this.toastr.error('This task is already selected, please select another one');

    if(this.projects[projectCardI].tasks[taskIndex].status == this.statuses.cancelled)
      return this.toastr.error('This task is cancelled, please select another one');

    let selectedProject = this.projects[projectCardI],
        projectId = selectedProject.id,
        tasks = this.objectsOperationsService.copyArrayOfObjects(selectedProject.tasks);
    
    tasks[taskIndex].status = this.statuses.current;
    this.busyAddingActiveTask = true;
    this.renderer.setStyle(loader, 'display', 'inline-block');
    try {
      this.projectsService.updateTasks(projectId, tasks)
      .then(res => {
        this.projects[projectCardI].tasks[taskIndex].status = this.statuses.current;
        this.busyAddingActiveTask = false;
        this.renderer.setStyle(loader, 'display', 'none');
      })
      .catch(err => {
        this.toastr.error('Something went wrong, please try again');
        this.busyAddingActiveTask = false;
        this.renderer.setStyle(loader, 'display', 'none');
      })
    } catch (error) {
      this.toastr.error('Something went wrong, please try again');
      this.busyAddingActiveTask = false;
      this.renderer.setStyle(loader, 'display', 'none');
    }
  }

  editTask(taskIndex, projectIndex) {
    let tasks = this.objectsOperationsService.copyArrayOfObjects(this.projects[projectIndex].tasks);
    let task = Object.assign({}, this.projects[projectIndex].tasks[taskIndex]);
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '60%',
      data: {task, tasks}
    });

    dialogRef.afterClosed().subscribe(result => {
      // searh for task with task id and replace it
      if(result) {
        let index = this.projects.findIndex(p => p.id == result.task.projectId);
        let taskIndex = this.projects[index].tasks.findIndex(task => task.id == result.task.id);
        this.projects[index].tasks[taskIndex] = Object.assign({}, result.task);
      }
    });
  }

  cancelTask(projectCardI, taskIndex, loader) {
    if(this.projects[projectCardI].tasks[taskIndex].status == this.statuses.completed)
      return this.toastr.error('This task is completed, please select another one');

    if(this.projects[projectCardI].tasks[taskIndex].status == this.statuses.cancelled)
      return this.toastr.error('This task is cancelled, please select another one');

      let selectedProject = this.projects[projectCardI],
        projectId = selectedProject.id,
        tasks = this.objectsOperationsService.copyArrayOfObjects(selectedProject.tasks);
    
    tasks[taskIndex].status = this.statuses.cancelled;
    this.busyAddingActiveTask = true;
    this.renderer.setStyle(loader, 'display', 'inline-block');
    try {
      this.projectsService.updateTasks(projectId, tasks)
      .then(res => {
        this.projects[projectCardI].tasks[taskIndex].status = this.statuses.cancelled;
        this.busyAddingActiveTask = false;
        this.renderer.setStyle(loader, 'display', 'none');
      })
      .catch(err => {
        this.toastr.error('Something went wrong, please try again');
        this.busyAddingActiveTask = false;
        this.renderer.setStyle(loader, 'display', 'none');
      })
    } catch (error) {
      this.toastr.error('Something went wrong, please try again');
      this.busyAddingActiveTask = false;
      this.renderer.setStyle(loader, 'display', 'none');
    }
  }

}
