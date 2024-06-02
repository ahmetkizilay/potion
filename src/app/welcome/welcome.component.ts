import { Component, ElementRef, ViewChild, inject} from '@angular/core';
import { Observable, filter, first, lastValueFrom, map } from 'rxjs';
import { UserService } from '../user/user.service';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { WelcomeService } from './welcome.service';

@Component({
  standalone: true,
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  imports: [AsyncPipe]
})
export class WelcomeComponent {
	private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private welcomeService: WelcomeService = inject(WelcomeService);
  @ViewChild('text') textContainer!: ElementRef<HTMLDivElement>;

  username$: Observable<string> = this.userService.user$.pipe(map(user => user?.email ?? 'Anonymous'));

  async logout() {
    await this.userService.logout();
    await lastValueFrom(this.userService.isSignedIn$.pipe(filter(val => !val), first()));
		return this.router.navigate(['/logout']);
  }

  save() {
    const text = this.textContainer.nativeElement.innerText;
    this.welcomeService.save(text).then(() => {
      console.log('Saved text:', text);
    });
  }
}
