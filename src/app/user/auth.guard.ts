import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';
import { of, switchMap } from 'rxjs';

export const requireLogin: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.isSignedIn$.pipe(switchMap(isSignedIn => {
    if (!isSignedIn) {
      router.navigate(["/login"]);
    }
    return of(isSignedIn);
  }));
};