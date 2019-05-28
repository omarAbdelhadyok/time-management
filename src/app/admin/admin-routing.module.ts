import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { AdminComponent } from './admin.component';
import { CreateProjectComponent } from './create-project/create-project.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {path: '', redirectTo: 'tasks', pathMatch: 'full'},
            {path: 'tasks', component: TasksComponent},
            {path: 'create-project', component: CreateProjectComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}