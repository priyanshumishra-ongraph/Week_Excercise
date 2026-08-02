import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // In a real app, this would be managed via localStorage and backend calls
  private token: string | null = 'mock-jwt-token-12345';

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  login() {
    this.token = 'mock-jwt-token-12345';
  }

  logout() {
    this.token = null;
  }
}
