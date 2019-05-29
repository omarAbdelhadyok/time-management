import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { TasksComponent } from './tasks/tasks.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminComponent } from './admin.component';
import { MaterialImportsModule } from '../shared/modules/material-imports.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TasksComponent,
    CreateProjectComponent,
    AdminHeaderComponent,
    AdminComponent
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
