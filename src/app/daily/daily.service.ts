import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { UserService } from '../user/user.service';
import { WithUserService, WaitForUser } from '../user/auth.decorator';

export interface Daily {
  text: string;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class DailyService implements WithUserService {
  userService = inject(UserService);

  private firestore = inject(Firestore);

  @WaitForUser()
  async getOrDefault(title: string): Promise<Daily> {
    if (this.userService.user == null) {
      console.error('User not logged in');
      return { text: '', title };
    }

    const userId = this.userService.user.userId;
    let daily: Daily = { text: '', title };
    try {
      const docRef = doc(this.firestore, 'users', userId, 'dailies', title);
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

  @WaitForUser()
  async save(daily: Daily): Promise<boolean> {
    if (this.userService.user == null) {
      console.error('User not logged in');
      return false;
    }
    const userId = this.userService.user.userId;

    try {
      const { text, title } = daily;
      const docRef = doc(this.firestore, 'users', userId, 'dailies', title);
      await setDoc(docRef, { text, title });
      return true;
    } catch (e) {
      console.error('Error saving text:', e);
      return false;
    }
  }
}
