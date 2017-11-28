import { connectionAPI } from '../../environments/connectionAPI';
import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';

import { JwtService } from './jwt.service';

@Injectable()
export class ApiService {
  constructor(
    private http: Http,
    private jwtService: JwtService,
    private router: Router,
  ) {
    this.connection = connectionAPI.apiURL;
  }
  private token: string;
  private connection: string;

  private setHeaders(): Headers {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.jwtService.getToken());
    return headers;
  }

  private formatErrors(error: any) {
    if (error.status === 401) {
      this.router.navigateByUrl('/pages/login');
      localStorage.removeItem('token');
      return;
    }
    return Observable.throw(error);
  }

  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
    return this.http.get(
      `${this.connection}${path}`,
      { headers: this.setHeaders() })
      .map((res: Response) => res.json())
      .catch(this.formatErrors.bind(this));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${this.connection}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() },
    )
      .map((res: Response) => res.json(), this)
      .catch(this.formatErrors.bind(this));
  }

  post(path: string, body: Object = {}): Observable<any> {
    const thatRouter = this.router;
    return this.http.post(
      `${this.connection}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() },
    )
      .map((res: Response) => res.json())
      .catch(this.formatErrors);
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${this.connection}${path}`,
      { headers: this.setHeaders() },
    )
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  authenticateToken(): Boolean {
    if (!this.jwtService.isTokenValid(this.token)) {
      return false;
    }
    return true;
  }
}
