import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom, filter, first } from 'rxjs';
import { UserService } from '../user/user.service';

@Component({
	standalone: true,
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	imports: [ReactiveFormsModule],
})
export class LoginComponent {
	private router: Router = inject(Router);
	private userService: UserService = inject(UserService);

	loginForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});

	async login() {
		if (this.loginForm.invalid) {
			console.error('Invalid form');
			return;
		}

		const email = this.loginForm.value.email!.trim();
		const password = this.loginForm.value.password!.trim();
		const success = await this.userService.login(email, password);
		if (success) {
			// filter is a trick to make sure the authstate is updated before navigating to home.
			await lastValueFrom(this.userService.isSignedIn$.pipe(filter(val => val), first()));
			return this.router.navigate(['/']);
		}

		return;
	}
}