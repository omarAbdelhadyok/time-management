import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { Project } from 'src/app/shared/models/project.model';
import { MatSelectChange } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { Task } from 'src/app/shared/models/task.model';
import { ActiveTasksService } from 'src/app/shared/services/active-tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  @ViewChild('addTaskFrom') addTaskFrom: NgForm;

  projects: Project[] = [];
  noData: boolean = false;
  displayedMsg: string;

  currentTasks: Task[] = [];
  noTasksData: boolean = false;
  displayedTasksMsg: string;

  selectedProjInd: number;
  selectedTaskInd: number;

  constructor(private projectsService: ProjectsService,
    private activeTasksService: ActiveTasksService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getAllProjects();
    this.getActiveTasks();
  }

  getActiveTasks() {
    try {
      this.activeTasksService.getAll()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          const data = doc.data() as Task;
          const id = doc.id;
          this.currentTasks.push({ id, ...data });
        })
        if(this.currentTasks.length !== 0) {
          this.noTasksData = false;
        } else {
          //no data to display (data length === 0)
          this.noTasksData = true;
          this.displayedTasksMsg = 'No tasks yet ...';
        }
      })
      .catch(err => {
        console.log(err);
        this.noTasksData = true;
        this.displayedTasksMsg = 'Something seem to be wrong, please reload the page ...';
      })
    } catch (error) {
      console.log(error);
      this.noTasksData = true;
      this.displayedTasksMsg = 'Something seem to be wrong, please reload the page ...';
    }
  }

  getAllProjects() {
    try {
      this.projectsService.getAll().then(snapshot => {
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

  selectProject(selection: MatSelectChange) {
    this.selectedProjInd = selection.value;
  }

  selectTask(selection: MatSelectChange) {
    this.selectedTaskInd = selection.value;
  }

  addTask() {
    if(this.projects[this.selectedProjInd].tasks[this.selectedTaskInd].current == true)
      return this.toastr.error('This task is already selected, please select another one')
    this.currentTasks.push(this.projects[this.selectedProjInd].tasks[this.selectedTaskInd]);
    this.projects[this.selectedProjInd].tasks[this.selectedTaskInd].current = true;
    //mark in the main project as selected
    // create the task in the current tasks collection NOTE!!!
    this.addTaskFrom.resetForm();
    this.selectedProjInd = undefined;
    this.selectedTaskInd = undefined;
  }

  deleteCurrentFromTasks(taskIndex) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this task?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.currentTasks.splice(taskIndex, 1);
        //delete from backend too
        //mark in the main project as not selected
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.warning('Delete cancelled!');
      }
    })
  }

  selectTaskFromCurrentTasks(taskIndex) {

  }

}
