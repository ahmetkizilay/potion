import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DailyComponent } from './daily/daily.component';
import { requireLogin } from './user/auth.guard';

export const routes: Routes = [
	{
		path: 'login',
		title: 'Login',
		component: LoginComponent,
	},
	{
		path: 'logout',
		redirectTo: '/login'
	},
	{
		path: '',
		component: DailyComponent,
		canActivate: [requireLogin],
	},
];
