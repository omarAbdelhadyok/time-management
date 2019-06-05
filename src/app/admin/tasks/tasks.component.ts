import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { Project } from 'src/app/shared/models/project.model';
import { MatSelectChange, MatSelect, MatInput } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ObjectsOperationsService } from 'src/app/shared/services/local/object-operations.service';
import * as uuidv1 from 'uuid/v1.js';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { Task } from 'src/app/shared/models/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  animations: [
    trigger('tasksEnter', [
      state('void', style({
        'left': '-30px',
        'top': '-30px',
        'opacity': '0'
      })),
      state('shown', style({
        'left': '0',
        'top': '0',
        'opacity': '1'
      })),
      transition('void <=> *', [animate('0.3s ease-in-out')])
    ])
  ]
})
export class TasksComponent implements OnInit {

  @ViewChild('addTaskFrom') addTaskFrom: NgForm;
  @ViewChild('projectTaskFrom') projectTaskFrom: NgForm;

  projects: Project[] = [];
  noData: boolean = false;
  displayedMsg: string;

  selectedProjInd: number;
  selectedTaskInd: number;
  busyAddingActiveTask: boolean = false;
  busyDeletingActiveTask: boolean = false;
  busySettingTaskComplete: boolean = false;

  busyAddingNewProjectTask: boolean = false;
  busyClosingProject: boolean = false;

  panelOpenState: boolean = false;

  constructor(private projectsService: ProjectsService,
    private toastr: ToastrService,
    private objectsOperationsService: ObjectsOperationsService) { }

  ngOnInit() {
    this.getAllProjects();
  }

  reset() {
    this.projects = [];
    this.noData = false;
    this.displayedMsg = undefined;
  }

  //getting all projects
  getAllProjects() {
    try {
      this.projectsService.getActive().then(snapshot => {
        snapshot.docs.map(doc => {
          const data = doc.data() as Project;
          const id = doc.id;
          this.projects.push({ id, ...data });
        })
        if(this.projects.length !== 0) {
          this.noData = false;
        } else {
          //no data to display (data length === 0)
          this.noData = true;
          this.displayedMsg = 'No projects yet ...';
        }
      })
      .catch(err => {
        console.log(err);
        this.noData = true;
        this.displayedMsg = 'Something seem to be wrong, please reload the page ...';
      })
    } catch (error) {
      console.log(error);
      this.noData = true;
      this.displayedMsg = 'Something seem to be wrong, please reload the page ...';
    }
  }

    
  //active tasks methods

  //selects a project to add a task from this project to the active tasks
  selectProjectFromActive(selection: MatSelectChange) {
    this.selectedProjInd = selection.value;
  }

  //select the task to add to active tasks
  selectTaskFromActive(selection: MatSelectChange) {
    this.selectedTaskInd = selection.value;
  }

  //addong task to the active setting it in its project as current = true
  addTaskToActiveTasks() {
    if(this.projects[this.selectedProjInd].tasks[this.selectedTaskInd].current == true)
      return this.toastr.error('This task is already completed, please select another one')

    if(this.projects[this.selectedProjInd].tasks[this.selectedTaskInd].done == true)
      return this.toastr.error('This task is already selected, please select another one')

    let selectedProject = this.projects[this.selectedProjInd],
        projectId = selectedProject.id,
        tasks = this.objectsOperationsService.copyArrayOfObjects(selectedProject.tasks);
    
    tasks[this.selectedTaskInd].current = true;
    this.busyAddingActiveTask = true;
    try {
      this.projectsService.updateTasks(projectId, tasks)
      .then(res => {
        this.projects[this.selectedProjInd].tasks[this.selectedTaskInd].current = true;
        this.addTaskFrom.resetForm();
        this.selectedProjInd = undefined;
        this.selectedTaskInd = undefined;
        this.busyAddingActiveTask = false;
      })
      .catch(err => {
        console.log(err)
        this.toastr.error('Something went wrong, please try again');
        this.busyAddingActiveTask = false;
      })
    } catch (error) {
      console.log(error)
      this.toastr.error('Something went wrong, please try again');
      this.busyAddingActiveTask = false;
    }
  }

  //delete task from the active setting it in its project as current = false
  deleteTaskFromActiveTasks(projectIndex, taskIndex) {
    let project = this.projects[projectIndex],
        tasks = this.objectsOperationsService.copyArrayOfObjects(project.tasks);

        tasks[taskIndex].current = false;
    try {
      this.busyDeletingActiveTask = true;
      this.projectsService.updateTasks(project.id, tasks)
      .then(res => {
        this.busyDeletingActiveTask = false;
        project.tasks[taskIndex].current = false;
      })
      .catch(err => {
        this.toastr.error('Something went wrong, please try again');
        console.log(err);
        this.busyDeletingActiveTask = false;
      })
    } catch (error) {
      this.toastr.error('Something went wrong, please try again');
      console.log(error);
      this.busyDeletingActiveTask = false;
    }
  }

  handleCancelDeletingActiveTask(event) {
    this.toastr.info('You cancelled deleting the task');
  }

  setTaskAsDone(projectIndex, taskIndex) {
    let project = this.projects[projectIndex],
        tasks = this.objectsOperationsService.copyArrayOfObjects(project.tasks);

    tasks[taskIndex].current = false;
    tasks[taskIndex].done = true;

    try {
      this.busySettingTaskComplete = true;
      this.projectsService.updateTasks(project.id, tasks)
      .then(res => {
        this.busySettingTaskComplete = false;
        project.tasks[taskIndex].done = true;
        project.tasks[taskIndex].current = false;
      })
      .catch(err => {
        this.toastr.error('Something went wrong, please try again');
        console.log(err);
        this.busySettingTaskComplete = false;
      })
    } catch (error) {
      this.toastr.error('Something went wrong, please try again');
      console.log(error);
      this.busySettingTaskComplete = false;
    }

  }



  //projects methods
  
  addNewTaskToProject(taskInput: MatInput, durationInput: MatInput, unitSelect: MatSelect, projectCardIndex) {
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
      this.busyAddingNewProjectTask = true;
      this.projectsService.updateTasks(project.id, tasks)
      .then(res => {
        this.busyAddingNewProjectTask = false;
        this.projects[projectCardIndex].tasks.push(newTask);
        this.projectTaskFrom.resetForm();
        this.toastr.success('Task was added successfully');
      })
      .catch(err => {
        this.toastr.error('Something went wrong, please try again');
        console.log(err);
        this.busyAddingNewProjectTask = false;
      })
    } catch (error) {
      this.toastr.error('Something went wrong, please try again');
      console.log(error);
      this.busyAddingNewProjectTask = false;
    }
  }

  closeProject(projectId) {
    try {
      this.busyClosingProject = true;
      this.projectsService.toggleProject(projectId, true)
      .then(res => {
        this.busyClosingProject = false;
        this.reset();
        this.getAllProjects();
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
