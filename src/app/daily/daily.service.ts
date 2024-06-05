import { Injectable, inject } from "@angular/core";
import { Firestore, addDoc, CollectionReference, collection } from '@angular/fire/firestore';

export interface Daily {
  text: string;
}

@Injectable(
  { providedIn: 'root' }
)
export class DailyService {
  private firestore = inject(Firestore);
  dailyCollection: CollectionReference;

  constructor() {
    this.dailyCollection = collection(this.firestore, 'dailies');
  }
  async save(text: string) {
    try {
      const docReference = await addDoc(this.dailyCollection, <Daily> { text });
      console.log(docReference.id);
    } catch (e) {
      console.error('Error saving text:', e);
    }
  }
}
