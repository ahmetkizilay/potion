import { TestBed, waitForAsync } from '@angular/core/testing';
import { DailyComponent } from './daily.component';
import { UserService } from '../user/user.service';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Daily, DailyService } from './daily.service';

class MockUserService {
  user$: Observable<any | null> = of(null);
  isSignedIn$: Observable<boolean> = of(false);
  logout() { }
}
class MockDailyService {
  save(_daily: Daily): Promise<boolean> {
    return Promise.resolve(false);
  }
  getOrDefault(_title: string): Promise<Daily> {
    return Promise.resolve({ text: '', title: '' });
  }
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

    spyOn(dailyService, 'save').and.returnValue(Promise.resolve(true));

    const fixture = TestBed.createComponent(DailyComponent);
    const component = fixture.componentInstance;

    const content = 'Lorem ipsum dolor sit amet';
    const title = '2023-03-02';

    fixture.detectChanges();
    component.textContainer.nativeElement.innerText = content;

    const btnSave = fixture.debugElement.query(By.css('button#btn-save'));
    btnSave.triggerEventHandler('click', null);

    expect(dailyService.save).toHaveBeenCalledWith({text: content, title});

    jasmine.clock().uninstall();
  });

  it('notifies for successful save', async() => {
    spyOn(dailyService, 'save').and.returnValue(Promise.resolve(true));
    const fixture = TestBed.createComponent(DailyComponent);
    const component = fixture.componentInstance;

    const content = 'Lorem ipsum dolor sit amet';
    fixture.detectChanges();
    component.textContainer.nativeElement.innerText = content;

    const btnSave = fixture.debugElement.query(By.css('button#btn-save'));
    btnSave.triggerEventHandler('click', null);

    expect(dailyService.save).toHaveBeenCalled();

    await fixture.whenStable();

    const notifySaved = component.notifySaved.nativeElement;
    expect(notifySaved.classList).toContain('highlighted');
    expect(notifySaved.classList).toContain('success');
  });

  it('notifies for failing save', async () => {
    spyOn(dailyService, 'save').and.returnValue(Promise.resolve(false));
    const fixture = TestBed.createComponent(DailyComponent);
    const component = fixture.componentInstance;


    const content = 'Lorem ipsum dolor sit amet';
    fixture.detectChanges();
    component.textContainer.nativeElement.innerText = content;

    const btnSave = fixture.debugElement.query(By.css('button#btn-save'));
    btnSave.triggerEventHandler('click', null);

    expect(dailyService.save).toHaveBeenCalled();

    await fixture.whenStable();

    const notifySaved = component.notifySaved.nativeElement;
    expect(notifySaved.classList).toContain('highlighted');
    expect(notifySaved.classList).toContain('error');
  });

  it('loads the daily', async () => {
    jasmine.clock().install();
    const mockCurrentDate = new Date(2023, 2, 2); // Note: JavaScript Date object's month is 0-indexed
    jasmine.clock().mockDate(mockCurrentDate);

    const daily = { text: 'Lorem ipsum dolor sit amet', title: '2023-03-02' };
    spyOn(dailyService, 'getOrDefault').and.returnValue(Promise.resolve(daily));

    const fixture = TestBed.createComponent(DailyComponent);
    const component = fixture.componentInstance;
    expect(component.dailyLoaded).toBe(false);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(dailyService.getOrDefault).toHaveBeenCalledWith('2023-03-02');
    expect(component.textContainer.nativeElement.innerText).toBe(daily.text);
    expect(component.dailyLoaded).toBe(true);

    jasmine.clock().uninstall();
  });
});
