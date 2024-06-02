import { Injectable, inject } from "@angular/core";
import { Firestore, addDoc, CollectionReference, collection } from '@angular/fire/firestore';

export interface MorningPage {
  text: string;
}

@Injectable(
  { providedIn: 'root' }
)
export class WelcomeService {
  private firestore = inject(Firestore);
  morningPageCollection: CollectionReference;

  constructor() {
    this.morningPageCollection = collection(this.firestore, 'morningPages');
  }
  async save(text: string) {
    try {
      const docReference = await addDoc(this.morningPageCollection, <MorningPage> { text });
      console.log(docReference.id);
    } catch (e) {
      console.error('Error saving text:', e);
    }
  }
}
