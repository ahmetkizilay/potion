import { Injectable } from "@angular/core";

@Injectable(
    {providedIn: 'root'}
)
export class UserService {
  constructor() {}
  
  login(email: string, password: string) {
    console.log(email, password);
  }
}