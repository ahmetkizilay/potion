import { TestBed, tick, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UserService } from '../user/user.service';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let loginSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    const userService = jasmine.createSpyObj('UserService', ['login']);
    loginSpy = userService.login;
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();
  }));

  it('should create the Login component', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call login method', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.loginForm.controls.email.setValue('email');
    component.loginForm.controls.password.setValue('password');

    fixture.detectChanges();

    const formSubmit = fixture.debugElement.query(By.css('form'));
    formSubmit.triggerEventHandler('submit');

    expect(loginSpy).toHaveBeenCalledOnceWith('email', 'password');
  });
});
