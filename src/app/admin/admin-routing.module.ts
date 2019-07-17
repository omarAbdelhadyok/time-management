import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { AdminComponent } from './admin.component';
import { CreateProjectComponent } from './projects/create-project/create-project.component';
import { loggedInGuard } from '../shared/services/guards/logged-guard.service';
import { UserComponent } from './user/user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { ProjectsComponent } from './projects/projects.component';
import { NotesComponent } from './notes/notes.component';
import { FavColorsComponent } from './notes/fav-colors/fav-colors.component';
import { TodoComponent } from './todo/todo.component';
import { CanDeactivateGuard } from '../shared/services';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {path: '', redirectTo: 'tasks', pathMatch: 'full'},
            {path: 'tasks', canActivate: [loggedInGuard], component: TasksComponent},
            {path: 'projects', canActivate: [loggedInGuard], component: ProjectsComponent},
            {path: 'create-project', canActivate: [loggedInGuard], canDeactivate: [CanDeactivateGuard], component: CreateProjectComponent},
            {path: 'edit-project/:id', canActivate: [loggedInGuard], component: CreateProjectComponent},
            {path: 'profile', canActivate: [loggedInGuard], component: UserComponent},
            {path: 'edit-profile/:id', canActivate: [loggedInGuard], component: EditUserComponent},
            {path: 'notes', canActivate: [loggedInGuard], component: NotesComponent},
            {path: 'favorite-colors', canActivate: [loggedInGuard], component: FavColorsComponent},
            {path: 'todo-list', canActivate: [loggedInGuard], component: TodoComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}