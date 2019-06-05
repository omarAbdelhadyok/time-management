import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { AdminComponent } from './admin.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { loggedInGuard } from '../shared/services/guards/logged-guard.service';
import { UserComponent } from './user/user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {path: '', redirectTo: 'tasks', pathMatch: 'full'},
            {path: 'tasks', canActivate: [loggedInGuard], component: TasksComponent},
            {path: 'create-project', canActivate: [loggedInGuard], component: CreateProjectComponent},
            {path: 'edit-project/:id', canActivate: [loggedInGuard], component: CreateProjectComponent},
            {path: 'profile', canActivate: [loggedInGuard], component: UserComponent},
            {path: 'edit-profile/:id', canActivate: [loggedInGuard], component: EditUserComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}