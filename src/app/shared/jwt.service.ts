import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

  declare var auth0: any;
@Injectable()
export class JwtService {
  isTokenValid(token: string): Boolean {
    auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN
  });
    const jwtHelper: JwtHelper = new JwtHelper();
    return jwtHelper.isTokenExpired(token);
  }
  getToken(): string {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: string) {
    window.localStorage['jwtToken'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

}