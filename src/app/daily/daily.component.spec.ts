import { TestBed, waitForAsync } from '@angular/core/testing';
import { DailyComponent } from './daily.component';
import { UserService } from '../user/user.service';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DailyService } from './daily.service';

class MockUserService {
  user$: Observable<any | null> = of(null);
  isSignedIn$: Observable<boolean> = of(false);
  logout() { }
}
class MockDailyService {
  save(_content: string, _title: string) { }
}

describe('DailyComponent', () => {
  let userService: MockUserService;
  let dailyService: MockDailyService;

  beforeEach(waitForAsync(() => {
    userService = new MockUserService();
    dailyService = new MockDailyService();
    TestBed.configureTestingModule({
      imports: [DailyComponent],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: DailyService, useValue: dailyService },
      ],
    }).compileComponents();
  }));

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('renders the component', () => {
    const fixture = TestBed.createComponent(DailyComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('displays the user email', () => {
    userService.user$ = of({ email: 'email' });
    const fixture = TestBed.createComponent(DailyComponent);
    const component = fixture.componentInstance;
    component.username$.subscribe(username => {
      expect(username).toBe('email');
    });
  });

  it('displays the null user', () => {
    userService.user$ = of(null);
    const fixture = TestBed.createComponent(DailyComponent);
    const component = fixture.componentInstance;
    component.username$.subscribe(username => {
      expect(username).toBe('Anonymous');
    });
  });

  it('logs out the user', () => {
    spyOn(userService, 'logout');

    const fixture = TestBed.createComponent(DailyComponent);

    const btnLogout = fixture.debugElement.query(By.css('button#btn-logout'));
    btnLogout.triggerEventHandler('click', null);

    expect(userService.logout).toHaveBeenCalled();
  });

  it('contains a textContent element', () => {
    const fixture = TestBed.createComponent(DailyComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.textContainer).toBeTruthy();
  });

  it('calls save', () => {
    jasmine.clock().install();
    const mockCurrentDate = new Date(2023, 2, 2); // Note: JavaScript Date object's month is 0-indexed
    jasmine.clock().mockDate(mockCurrentDate);

    spyOn(dailyService, 'save');

    const fixture = TestBed.createComponent(DailyComponent);
    const component = fixture.componentInstance;

    const content = 'Lorem ipsum dolor sit amet';
    const title = '2023-03-02';
    fixture.detectChanges();
    component.textContainer.nativeElement.innerText = content;

    const btnSave = fixture.debugElement.query(By.css('button#btn-save'));
    btnSave.triggerEventHandler('click', null);

    expect(dailyService.save).toHaveBeenCalledWith(content, title);

    jasmine.clock().uninstall();
  });
});
