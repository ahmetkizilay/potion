import { Injectable, OnDestroy, inject } from "@angular/core";
import { Auth, User, user as userObs, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { ReplaySubject, Observable, Subscription } from "rxjs";

export interface PotionUser {
  userId: string;
}

@Injectable(
  { providedIn: 'root' }
)
export class UserService implements OnDestroy {
  private auth: Auth = inject(Auth);
  private userSub: Subscription;
  private currentUser: PotionUser | null = null;

  user$: Observable<User> = userObs(this.auth);
  isSignedIn$ = new ReplaySubject<boolean>(1);

  constructor() {
    this.userSub = this.user$.subscribe((user: User | null) => {
      const isSignedIn = user !== null;
      this.currentUser = isSignedIn ? { userId: user.uid } : null;
      this.isSignedIn$.next(isSignedIn);

      // subscription changed
      console.log('User changed. User is ', isSignedIn ? 'logged in' : 'logged out');
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
 }

  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (e) {
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  get user(): PotionUser|null {
    if (!this.currentUser) {
      return null;
    }
    return { ...this.currentUser };
  }
}
