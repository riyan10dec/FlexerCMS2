import { FXEmployee } from './fxemployee';
import { ApiService } from '../../shared/apiService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class FXEmployeeService {
    constructor(private apiService: ApiService) { }

    private getEmployeeDataQuery: string = '/cms/GetAllEmployees/@0/@1';
    private saveEmployeeQuery: string = '/cms/SaveEmployee';

    getEmployeeData(payload): Observable<any> {
        return this.apiService.get(this.getEmployeeDataQuery.replace('@0', payload.clientID).replace('@1', payload.gmtDiff)).map(data =>
            data);
    }
    saveEmployee(payload): Observable<any> {
        return this.apiService.post(this.saveEmployeeQuery, payload).map(data => data);
    }
}
