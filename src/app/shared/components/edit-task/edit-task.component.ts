import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Task } from 'src/app/shared/models';
import { ProjectsService } from '../../services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  task: Task;
  projectTasks: Task[];
  busySaving: boolean = false;

  constructor(public dialogRef: MatDialogRef<EditTaskComponent>,
    private projectsService: ProjectsService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.task = data.task;
      if(this.task.unit) {
        if(this.task.unit.endsWith('s')) this.task.unit = this.task.unit.slice(0, this.task.unit.length-1);
      }
      this.projectTasks = data.tasks;
    }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if(this.task.unit == 'null') this.task.unit = null;
    if((!this.task.duration && this.task.unit) || (this.task.duration && !this.task.unit))
      return this.toastr.warning('To add duration fill both duration and unit');
    if(parseInt(this.task.duration) > 1) this.task.unit = this.task.unit+'s';
    this.busySaving = true;
    let i = this.projectTasks.findIndex(el => el.id == this.task.id);
    this.projectTasks[i] = Object.assign(this.task, {});
    try {
      this.projectsService.updateTasks(this.task.projectId, this.projectTasks).then(res => {
        this.busySaving = false;
        this.dialogRef.close({tasks: this.projectTasks, task: this.task});
      }).catch(error => {
        this.toastr.error(error);
        this.busySaving = false;
      })
    } catch (error) {
      this.toastr.error(error);
      this.busySaving = false;
    }
  }

}
