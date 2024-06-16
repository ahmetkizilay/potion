import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { UserService } from '../user/user.service';
import {
  ReplaySubject,
  Subject,
  filter,
  firstValueFrom,
  takeUntil,
} from 'rxjs';

export interface Daily {
  text: string;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class DailyService implements OnDestroy {
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private userLoaded$ = new ReplaySubject<boolean>(1);
  private destroy$ = new Subject<void>();
  private userId: string | null = null;

  // Testing only: How long to wait for the user to be loaded.
  waitTimeForUser = 2000;

  constructor() {
    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      } else {
        console.error('User not logged in');
        this.userId = null;
      }
      this.userLoaded$.next(this.userId != null);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async getOrDefault(title: string): Promise<Daily> {
    await this.waitUntilUserLoaded();

    if (this.userId == null) {
      console.error('User not logged in');
      return { text: '', title };
    }

    let daily: Daily = { text: '', title };
    try {
      const docRef = doc(
        this.firestore,
        'users',
        this.userId,
        'dailies',
        title
      );
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        daily.text = data['text'];
      }
    } catch (e) {
      console.error('Error getting text:', e);
    }
    return daily;
  }

  async save(daily: Daily): Promise<boolean> {
    // To ensure that we have the user loaded before saving.
    await this.waitUntilUserLoaded();

    if (this.userId == null) {
      console.error('User not logged in');
      return false;
    }

    try {
      const { text, title } = daily;
      const docRef = doc(
        this.firestore,
        'users',
        this.userId,
        'dailies',
        title
      );
      await setDoc(docRef, { text, title });
      return true;
    } catch (e) {
      console.error('Error saving text:', e);
      return false;
    }
  }

  private async waitUntilUserLoaded() {
    await Promise.race([
      firstValueFrom(this.userLoaded$.pipe(filter((loaded) => loaded))),
      new Promise((_resolve, reject) => setTimeout(reject, this.waitTimeForUser)),
    ]);
  }
}
