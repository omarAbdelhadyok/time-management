import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

const components = [
  
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot()
  ],
  exports: [...components,
    SweetAlert2Module]
})
export class SharedModule { }
