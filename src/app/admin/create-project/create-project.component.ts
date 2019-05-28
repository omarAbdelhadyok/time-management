import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { Project } from 'src/app/shared/models/project.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import * as uuidv1 from 'uuid/v1.js';
import { MatInput } from '@angular/material';
import { Task } from 'src/app/shared/models/task.model';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  @ViewChild('projectForm') projectForm: NgForm;

  pageTitle: string = 'Add Project';
  project: Project = new Project();

  projectId;
  busyCreating: boolean = false;
  busyLoading: boolean = false;
  busyDeleting: boolean = false;
  busyUpdating: boolean = false;

  constructor(private projectsService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.projectId = this.route.snapshot.params.id;
    if(this.projectId) {
      this.getWorkById();
      this.pageTitle = 'Edit Work';
    } else {
      this.reset();
      this.pageTitle = 'Add Work';
    }
  }

  reset() {
    this.projectForm.resetForm();
    this.project = new Project();
  }

  //get article by id
  getWorkById() {
    try {
      this.busyLoading = true;
      this.projectsService.getById(this.projectId).subscribe(res => {
        if(res) {
          this.project = res;
        } else {
          this.router.navigate(['/admin']);
        }
        this.busyLoading = false;
      }, err => {
        this.busyLoading = false;
        this.toastr.error(err);
      })
    } catch (error) {
      this.busyLoading = false;
      this.toastr.error(error);      
    }
  }

  addTask(taskInput: MatInput) {
    let task = taskInput.value.trim();
    if(task == '') return this.toastr.error('Please type a valid task');
    let newTask: Task = {
      task: task,
      done: false,
      current: false
    }
    this.project.tasks.push(newTask)
  }

  onSave() {
    if(this.projectId) {
      // this.updateProject(this.workId);
    } else {
      this.createProject();
    }
  }

  //create new project
  createProject() {
    if(!this.project.title.trim() || !this.project.description.trim())
    return this.toastr.error('Please type valid values');

    if(!this.project.tasks || this.project.tasks.length == 0)
    return this.toastr.error('Please Add tasks to the project');

    this.busyCreating = true;
    try {
      let date = new Date();
      this.project.date = date.valueOf();
      let projectId = uuidv1();
      this.projectsService.create(projectId, this.project)
      .then(res => {
        this.busyCreating = false;
        this.toastr.success('Your project was successfully created');
        this.reset();
      })
      .catch(err => {
        this.toastr.error(err);
        this.busyCreating = false;
      })
    }
    catch (err) {
      this.toastr.error(err.message);
      this.busyCreating = false;
    }
  }

  updateProject(id) {
    if(!this.project.title.trim() || !this.project.description.trim())
    return this.toastr.error('Please type valid values');

    if(!this.project.tasks || this.project.tasks.length == 0)
    return this.toastr.error('Please Add tasks to the project');

    this.busyCreating = true;
    try {
      this.projectsService.update(id, this.project)
      .then(res => {
        this.busyCreating = false;
        this.toastr.success('Your project was successfully updated');
        this.router.navigate(['/admin/tasks']);
      })
      .catch(err => {
        this.toastr.error(err);
        this.busyCreating = false;
      })
    }
    catch (err) {
      this.toastr.error(err.message);
      this.busyCreating = false;
    }
  }

}
