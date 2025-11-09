import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtService {
  getToken(): string {
    return window.localStorage.getItem('jwt_token');
  }

  saveToken(token: string) {
    window.localStorage.setItem('jwt_token', token);
  }

  destroyToken() {
    window.localStorage.removeItem('jwt_token');
  }
}
