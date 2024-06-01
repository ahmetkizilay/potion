import { TestBed, waitForAsync } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    beforeEach(() => {
        TestBed.configureTestingModule({providers: [UserService]});
    });
    
    it('should use ValueService', () => {
        service = TestBed.inject(UserService);
        expect(service.login("email", "password")).toBe(undefined);
    });
});