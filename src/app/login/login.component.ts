import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom, filter, first } from 'rxjs';
import { UserService } from '../user/user.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);

  hasError = false;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  async login() {
    if (this.loginForm.invalid) {
      console.error('Invalid form');
      return;
    }

    this.hasError = false;

    const email = this.loginForm.value.email!.trim();
    const password = this.loginForm.value.password!.trim();
    const success = await this.userService.login(email, password);
    if (success) {
      // filter is a trick to make sure the authstate is updated before navigating to home.
      await lastValueFrom(this.userService.isSignedIn$.pipe(filter(val => val), first()));
      return this.router.navigate(['/']);
    }
    else {
      this.hasError = true;
    }

    return;
  }
}
