import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import * as uuidv1 from 'uuid/v1.js';
import { MatInput, MatSelect, MatDialog } from '@angular/material';
import { ObjectsOperationsService, AuthService } from 'src/app/shared/services';
import { statuses } from 'src/app/shared/services/local/task-statuses';
import { CanComponentDeactivate, Status, User, Task, Project } from 'src/app/shared/models';
import { ConfirmDeactivateComponent } from '../../../shared/components';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit, CanComponentDeactivate {

  @ViewChild('projectForm') projectForm: NgForm;

  pageTitle: string = 'Add Project';
  project: Project;
  projectBackUp: Project;
  user: User;
  isEdit: boolean = false;

  projectId;
  busyCreating: boolean = false;
  busyLoading: boolean = false;
  busyDeleting: boolean = false;
  busyUpdating: boolean = false;

  statuses: Status = statuses();

  //for dropdown to chose when isEdit
  projectStatus = [
    {name: 'Active', value: false},
    {name: 'Closed', value: true},
  ]

  constructor(private projectsService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService,
    private objectOperationsService: ObjectsOperationsService,
    private dialog: MatDialog
  ) {
    this.authService.user$.subscribe(res => this.user = res)
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.params.id;
    if(this.projectId) {
      this.getProjectById();
      this.pageTitle = 'Edit Project';
      this.isEdit = true;
    } else {
      this.reset();
      this.pageTitle = 'Add Project';
    }
  }

  //confirm method for canDeactivate
  async confirm() {
    if(!this.objectOperationsService.areEqualObjects(this.project, this.projectBackUp)) {
      const result = await this.openDialog();
      return result
    }
    return true;
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmDeactivateComponent, {
      width: '60%'
    });

    return dialogRef.afterClosed().toPromise();
  }

  reset() {
    this.projectForm.resetForm();
    this.project = new Project();
    this.projectBackUp = new Project();
  }

  //get project by id
  getProjectById() {
    try {
      this.busyLoading = true;
      this.projectsService.getById(this.projectId).subscribe(res => {
        if(res) {
          this.project = this.objectOperationsService.copyObjectwithArrayofObjects(res);
          this.projectBackUp = this.objectOperationsService.copyObjectwithArrayofObjects(res);    
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

  addTask(taskInput: MatInput, durationInput: MatInput, unitSelect: MatSelect) {
    let task = taskInput.value.trim(),
        duration = durationInput.value,
        unit = unitSelect.value;
    if(unit == 'null') unit = null;
    if((!duration && unit) || (duration && !unit))
      return this.toastr.warning('To add duration fill both duration and unit');
    if(!task) return this.toastr.error('Please type a valid task');
    if(parseInt(duration) > 1) unit = unit+'s';
    let newTask: Task = {
      task: task,
      status: this.statuses.holding,
      id: uuidv1(),
      duration,
      unit
    }
    this.project.tasks.push(newTask)
  }

  deleteTask(taskIndex) {
    this.project.tasks.splice(taskIndex, 1);
  }

  onSave() {
    if(this.projectId) {
      this.updateProject(this.projectId);
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
      this.project.uid = this.user.uid;
      this.project.closed = false;
      let projectId = uuidv1();
      this.project.tasks.forEach(task => task.projectId = projectId);
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

  cancelEdit() {
    this.project = this.objectOperationsService.copyObjectwithArrayofObjects(this.projectBackUp);
  }

  //experimntall -- should make a component to be able to select vides from the storage and get them on the list as tasks with names and durations -- popup ,, placed in the option of the card (the three dots)
  add($event) {
    console.log($event)
  }

}
