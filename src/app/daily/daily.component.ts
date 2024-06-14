import { Component, ElementRef, ViewChild, inject, Renderer2, OnInit } from '@angular/core';
import { Observable, filter, first, lastValueFrom, map } from 'rxjs';
import { UserService } from '../user/user.service';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Daily, DailyService } from './daily.service';

@Component({
  standalone: true,
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css'],
  imports: [AsyncPipe]
})
export class DailyComponent implements OnInit {
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private dailyService: DailyService = inject(DailyService);
  @ViewChild('text') textContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('notifySaved') notifySaved!: ElementRef<HTMLLabelElement>;

  readonly title: string;
  saveMessage = 'Saved';
  dailyLoaded = false;

  constructor(private renderer: Renderer2) {
    this.title = this.today();
  }

  async ngOnInit() {
    const daily = await this.dailyService.getOrDefault(this.title);
    this.textContainer.nativeElement.innerText = daily.text;
    this.dailyLoaded = true;
  }

  async logout() {
    await this.userService.logout();
    await lastValueFrom(this.userService.isSignedIn$.pipe(filter(val => !val), first()));
    return this.router.navigate(['/logout']);
  }

  save() {
    let daily: Daily = { text: this.textContainer.nativeElement.innerText, title: this.title, };
    this.dailyService.save(daily).then((result) => {
      this.triggerSaved(result);
    });
  }

  private triggerSaved(result: boolean) {
    this.renderer.removeClass(this.notifySaved.nativeElement, 'highlighted');
    this.renderer.removeClass(this.notifySaved.nativeElement, 'success');
    this.renderer.removeClass(this.notifySaved.nativeElement, 'error');
    // Trigger reflow
    const reflow = this.notifySaved.nativeElement.offsetWidth;
    this.renderer.addClass(this.notifySaved.nativeElement, result ? 'success' : 'error');
    this.renderer.addClass(this.notifySaved.nativeElement, 'highlighted');
  }

  private today(): string {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based in JS
    let day = currentDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
