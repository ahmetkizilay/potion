import { Injectable } from "@angular/core";

@Injectable(
  { providedIn: 'root' }
)
export class WelcomeService {
  save(text: string) {
    console.log('Saving text:', text)
  }
}
