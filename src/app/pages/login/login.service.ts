import { ApiService } from '../../shared/apiService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
    private signInQuery: string = '/cms/login';
    constructor(private apiService: ApiService) { }
    signIn(payload): Observable<any> {
        return this.apiService.post(this.signInQuery, payload).map(
            data => data,
            );
    }
}
