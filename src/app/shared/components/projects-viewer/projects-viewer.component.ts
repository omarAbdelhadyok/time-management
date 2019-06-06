import { Component, OnInit, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectsService } from '../../services/projects.service';
import { ToastrService } from 'ngx-toastr';
import { MatInput, MatSelect } from '@angular/material';
import { ObjectsOperationsService } from '../../services/local/object-operations.service';
import { Task } from '../../models/task.model';
import * as uuidv1 from 'uuid/v1.js';
import { NgForm } from '@angular/forms';

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

  constructor(private projectsService: ProjectsService,
    private toastr: ToastrService,
    private objectsOperationsService: ObjectsOperationsService,
    private renderer: Renderer2) { }

  ngOnInit() {
  }

  //projects methods
  
  addNewTaskToProject(taskInput: MatInput, durationInput: MatInput, unitSelect: MatSelect, projectCardIndex, loader, projectTaskFrom: NgForm) {
    let project = this.projects[projectCardIndex],
        tasks = this.objectsOperationsService.copyArrayOfObjects(project.tasks),
        task = taskInput.value.trim(),
        duration = durationInput.value,
        unit = unitSelect.value;
    if((!duration && unit) || (duration && !unit))
      return this.toastr.warning('To add duration fill both duration and unit');
    if(!task) return this.toastr.error('Please type a valid task');
    if(parseInt(duration) > 1) unit = unit+'s';
    let newTask: Task = {
      task: task,
      done: false,
      current: false,
      id: uuidv1(),
      time: `${duration} ${unit}`,
      projectId: project.id
    }
    tasks.push(newTask)
    try {
      this.renderer.setStyle(loader, 'display', 'inline-block');
      this.busyAddingNewProjectTask = true;
      this.projectsService.updateTasks(project.id, tasks)
      .then(res => {
        this.renderer.setStyle(loader, 'display', 'none');
        this.busyAddingNewProjectTask = false;
        this.projects[projectCardIndex].tasks.push(newTask);
        projectTaskFrom.resetForm();
        this.toastr.success('Task was added successfully');
      })
      .catch(err => {
        this.toastr.error('Something went wrong, please try again');
        console.log(err);
        this.busyAddingNewProjectTask = false;
        this.renderer.setStyle(loader, 'display', 'none');
      })
    } catch (error) {
      this.toastr.error('Something went wrong, please try again');
      console.log(error);
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
        console.log(err);
        this.busyClosingProject = false;
      })
    } catch (error) {
      this.toastr.error('Something went wrong, please try again');
      console.log(error);
      this.busyClosingProject = false;
    }
  }

}
