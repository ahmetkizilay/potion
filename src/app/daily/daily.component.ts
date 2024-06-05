import { Component, ElementRef, ViewChild, inject} from '@angular/core';
import { Observable, filter, first, lastValueFrom, map } from 'rxjs';
import { UserService } from '../user/user.service';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { DailyService } from './daily.service';

@Component({
  standalone: true,
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css'],
  imports: [AsyncPipe]
})
export class DailyComponent {
	private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private dailyService: DailyService = inject(DailyService);
  @ViewChild('text') textContainer!: ElementRef<HTMLDivElement>;

  username$: Observable<string> = this.userService.user$.pipe(map(user => user?.email ?? 'Anonymous'));

  async logout() {
    await this.userService.logout();
    await lastValueFrom(this.userService.isSignedIn$.pipe(filter(val => !val), first()));
		return this.router.navigate(['/logout']);
  }

  save() {
    const text = this.textContainer.nativeElement.innerText;
    this.dailyService.save(text).then(() => {
      console.log('Saved text:', text);
    });
  }
}
