import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialImportsModule } from './modules/material-imports.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { ProjectsViewerComponent, EditTaskComponent, ConfirmDeactivateComponent } from './components';
import { FilterPipe } from './pipes';

const components = [
  ProjectsViewerComponent,
  EditTaskComponent,
  ConfirmDeactivateComponent
]

const pipes = [
  FilterPipe
]

@NgModule({
  declarations: [...components, ...pipes],
  imports: [
    CommonModule,
    MaterialImportsModule,
    FormsModule,
    RouterModule,
    SweetAlert2Module.forRoot()
  ],
  entryComponents: [ConfirmDeactivateComponent, EditTaskComponent],
  exports: [...components,
    SweetAlert2Module, ...pipes]
})
export class SharedModule { }
