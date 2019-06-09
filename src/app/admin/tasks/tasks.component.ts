import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { Project } from 'src/app/shared/models/project.model';
import { MatSelectChange } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ObjectsOperationsService } from 'src/app/shared/services/local/object-operations.service';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { Task } from 'src/app/shared/models/task.model';
import { Status } from 'src/app/shared/models/status.model';
import { statuses } from 'src/app/shared/services/local/task-statuses';

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

  projects: Project[] = [];
  noData: boolean = false;
  displayedMsg: string;

  selectedProjInd: number;
  selectedTaskInd: number;
  busyAddingActiveTask: boolean = false;
  busyDeletingActiveTask: boolean = false;
  busySettingTaskComplete: boolean = false;

  statuses: Status = statuses();

  panelOpenState: boolean = false;

  constructor(private projectsService: ProjectsService,
    private toastr: ToastrService,
    private objectsOperationsService: ObjectsOperationsService,
    private renderer: Renderer2) { }

  ngOnInit() {
    this.getAllProjects('all');
  }

  reset() {
    this.projects = [];
    this.noData = false;
    this.displayedMsg = undefined;
  }

  //getting all projects
  getAllProjects(option) {
    try {
      this.projectsService.getAll(option).then(snapshot => {
        snapshot.docs.map(doc => {
          const data = doc.data() as Project;
          const id = doc.id;
          this.projects.push({ id, ...data });
        })
        if(this.projects.length !== 0) {
          this.projects = this.sortProjectsTasks(this.projects);
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

  //addong task to the active setting it in its project as status as current
  addTaskToActiveTasks() {
    if(this.projects[this.selectedProjInd].tasks[this.selectedTaskInd].status == this.statuses.completed)
      return this.toastr.error('This task is already completed, please select another one')

    if(this.projects[this.selectedProjInd].tasks[this.selectedTaskInd].status == this.statuses.current)
      return this.toastr.error('This task is already selected, please select another one')

    let selectedProject = this.projects[this.selectedProjInd],
        projectId = selectedProject.id,
        tasks = this.objectsOperationsService.copyArrayOfObjects(selectedProject.tasks);
    
    tasks[this.selectedTaskInd].status = this.statuses.current;
    this.busyAddingActiveTask = true;
    try {
      this.projectsService.updateTasks(projectId, tasks)
      .then(res => {
        this.projects[this.selectedProjInd].tasks[this.selectedTaskInd].status = this.statuses.current;
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

        tasks[taskIndex].status = this.statuses.holding;
    try {
      this.busyDeletingActiveTask = true;
      this.projectsService.updateTasks(project.id, tasks)
      .then(res => {
        this.busyDeletingActiveTask = false;
        project.tasks[taskIndex].status = this.statuses.holding;
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

  setTaskAsDone(projectIndex, taskIndex, loader) {
    let project = this.projects[projectIndex],
        tasks = this.objectsOperationsService.copyArrayOfObjects(project.tasks);

    tasks[taskIndex].status = this.statuses.completed;

    try {
      this.renderer.setStyle(loader, 'display', 'inline-block');
      this.busySettingTaskComplete = true;
      this.projectsService.updateTasks(project.id, tasks)
      .then(res => {
        this.busySettingTaskComplete = false;
        project.tasks[taskIndex].status = this.statuses.completed;
        this.projects = this.sortProjectsTasks(this.projects);
        this.renderer.setStyle(loader, 'display', 'none');
      })
      .catch(err => {
        this.toastr.error('Something went wrong, please try again');
        console.log(err);
        this.busySettingTaskComplete = false;
        this.renderer.setStyle(loader, 'display', 'none');
      })
    } catch (error) {
      this.toastr.error('Something went wrong, please try again');
      console.log(error);
      this.busySettingTaskComplete = false;
      this.renderer.setStyle(loader, 'display', 'none');
    }

  }


  sortProjectsTasks(projects: Project[]) {
    projects.map(project => {
      let arr: Task[] = [];
      project.tasks.map(task => {
        if(task.status == this.statuses.completed) {
          arr.unshift(task);
        } else {
          arr.push(task);
        }
        project.tasks = arr;
      })
    })
    return projects;
  }
  
}
