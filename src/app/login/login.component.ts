import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user/user.service';

@Component({
    standalone: true,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [ReactiveFormsModule],
})
export class LoginComponent {
    loginForm = new FormGroup({
        email: new FormControl(''),
        password: new FormControl(''),
    });

    constructor(private userService: UserService) { }

    login() {
        if (this.loginForm.invalid) {
            console.error('Invalid form');
            return;
        }
        const email = this.loginForm.value.email!.trim();
        const password = this.loginForm.value.password!.trim();
        this.userService.login(email, password);
    }
}