import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { TasksComponent } from './tasks/tasks.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { AdminComponent } from './admin.component';
import { MaterialImportsModule } from '../shared/modules/material-imports.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user/user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectsHeaderComponent } from './projects/projects-header/projects-header.component';

@NgModule({
  declarations: [
    TasksComponent,
    CreateProjectComponent,
    AdminComponent,
    UserComponent,
    EditUserComponent,
    ProjectsComponent,
    ProjectsHeaderComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialImportsModule,
    SharedModule,
    FormsModule
  ]
})
export class AdminModule { }
