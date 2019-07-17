import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { MaterialImportsModule } from '../shared/modules';
import { SharedModule } from '../shared/shared.module';

import { AdminComponent } from './admin.component';
import { TasksComponent } from './tasks';
import { UserComponent, EditUserComponent } from './user';
import { TodoComponent } from './todo';

import { NotesComponent,
  NotesHeaderComponent,
  CreateNoteComponent,
  FavColorsComponent 
} from './notes';

import { CreateProjectComponent,
  ProjectsComponent,
  ProjectsHeaderComponent
} from './projects';

@NgModule({
  declarations: [
    TasksComponent,
    CreateProjectComponent,
    AdminComponent,
    UserComponent,
    EditUserComponent,
    ProjectsComponent,
    ProjectsHeaderComponent,
    NotesComponent,
    NotesHeaderComponent,
    CreateNoteComponent,
    TodoComponent,
    FavColorsComponent
  ],
  entryComponents: [
    CreateNoteComponent
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
