import { Route } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './auth.guard';
import { AuthenticatedLayoutComponent } from '../layouts/authenticated-layout/authenticated-layout-component';
import { TeamComponent } from './team/team';
import { TasksComponent } from './tasks/tasks';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: AuthenticatedLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
  {
    path: 'team',
    component: AuthenticatedLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: TeamComponent,
      },
    ],
  },
  {
    path: 'tasks',
    component: AuthenticatedLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: TasksComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
