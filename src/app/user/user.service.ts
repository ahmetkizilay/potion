import { Injectable, OnDestroy, inject } from "@angular/core";
import { Auth, User, user, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { ReplaySubject, Observable, Subscription } from "rxjs";

@Injectable(
  { providedIn: 'root' }
)
export class UserService implements OnDestroy {
  private auth: Auth = inject(Auth);
  private userSub: Subscription;
  private isSignedIn = false;

  user$: Observable<User> = user(this.auth);
  isSignedIn$ = new ReplaySubject<boolean>(1);

  constructor() {
    this.userSub = this.user$.subscribe((user: User | null) => {
      this.isSignedIn = user !== null;
      this.isSignedIn$.next(this.isSignedIn);

      // subscription changed
      console.log('User changed. User is ', this.isSignedIn ? 'logged in' : 'logged out');
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
 }

  async login(email: string, password: string): Promise<boolean> {
    console.log(`Signing in: ${email}`);
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (e) {
      return false;
    }
  }

  async logout(): Promise<void> {
    console.log('Signing out');
    await signOut(this.auth);
  }
}
