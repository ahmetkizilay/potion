import { Injectable, inject } from "@angular/core";
import { Firestore, addDoc, CollectionReference, collection, updateDoc } from '@angular/fire/firestore';

export interface Daily {
  text: string;
  title: string;
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
  async save(text: string, title: string) {
    try {
      const docReference = await addDoc(this.dailyCollection, <Daily> { text, title });
      console.log(docReference.id);
    } catch (e) {
      console.error('Error saving text:', e);
    }
  }
}
