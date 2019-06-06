import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsViewerComponent } from './components/projects-viewer/projects-viewer.component';
import { MaterialImportsModule } from './modules/material-imports.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const components = [
  ProjectsViewerComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    MaterialImportsModule,
    FormsModule,
    RouterModule,
    SweetAlert2Module.forRoot()
  ],
  exports: [...components,
    SweetAlert2Module]
})
export class SharedModule { }
