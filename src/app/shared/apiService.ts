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
  // private hostname: string= connectionAPI.getHost();
  private headers: Headers = new Headers();
  private connection: string;

  private setHeaders(): Headers {
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Authorization', 'Bearer ' + this.jwtService.getToken());
    return this.headers;
  }

  private formatErrors(error: any) {
    if (error.status === -3) {
      this.router.navigateByUrl('/pages/login');
    }
    return Observable.throw(error);
  }

  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
    return this.http.get(
      `${this.connection}${path}`,
      { headers: this.setHeaders() })
      .map((res: Response) => res.json())
      .catch(this.formatErrors);
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${this.connection}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() },
    )
      .map((res: Response) => res.json())
      .catch(this.formatErrors);
  }

  post(path: string, body: Object = {}): Observable<any> {
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
