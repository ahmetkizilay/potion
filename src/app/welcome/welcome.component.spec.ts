import { TestBed, waitForAsync } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { UserService } from '../user/user.service';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { WelcomeService } from './welcome.service';

class MockUserService {
  user$: Observable<any | null> = of(null);
  isSignedIn$: Observable<boolean> = of(false);
  logout() { }
}
class MockWelcomeService {
  save(_: string) { }
}

describe('WelcomeComponent', () => {
  let userService: MockUserService;
  let welcomeService: MockWelcomeService;
  beforeEach(waitForAsync(() => {
    userService = new MockUserService();
    welcomeService = new MockWelcomeService();
    TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: WelcomeService, useValue: welcomeService },
      ],
    }).compileComponents();
  }));

  it('renders the component', () => {
    const fixture = TestBed.createComponent(WelcomeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('displays the user email', () => {
    userService.user$ = of({ email: 'email' });
    const fixture = TestBed.createComponent(WelcomeComponent);
    const component = fixture.componentInstance;
    component.username$.subscribe(username => {
      expect(username).toBe('email');
    });
  });

  it('displays the null user', () => {
    userService.user$ = of(null);
    const fixture = TestBed.createComponent(WelcomeComponent);
    const component = fixture.componentInstance;
    component.username$.subscribe(username => {
      expect(username).toBe('Anonymous');
    });
  });

  it('logs out the user', () => {
    spyOn(userService, 'logout');

    const fixture = TestBed.createComponent(WelcomeComponent);
    const component = fixture.componentInstance;

    const btnLogout = fixture.debugElement.query(By.css('button#btn-logout'));
    btnLogout.triggerEventHandler('click', null);

    expect(userService.logout).toHaveBeenCalled();
  });

  it('contains a textContent element', () => {
    const fixture = TestBed.createComponent(WelcomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.textContainer).toBeTruthy();
  });

  it('calls save', () => {
    spyOn(welcomeService, 'save');

    const fixture = TestBed.createComponent(WelcomeComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    component.textContainer.nativeElement.innerText = 'Lorem ipsum dolor sit amet';

    const btnSave = fixture.debugElement.query(By.css('button#btn-save'));
    btnSave.triggerEventHandler('click', null);

    expect(welcomeService.save).toHaveBeenCalledWith('Lorem ipsum dolor sit amet');

  });
});
