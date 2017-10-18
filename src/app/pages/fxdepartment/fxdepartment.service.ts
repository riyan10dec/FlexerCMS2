import { FXDepartment } from './fxdepartment';
import { ApiService } from '../../shared/apiService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class FXDepartmentService {
    constructor(private apiService: ApiService) { }

    private getDepartmentDataQuery: string = '/cms/GetAllDepartments/@0/@1';
    private saveDepartmentQuery: string = '/cms/SaveDepartment';

    getDepartmentData(payload): Observable<any> {
        return this.apiService.get(this.getDepartmentDataQuery.replace('@0', payload.clientID).replace('@1', payload.gmtDiff)).map(data =>
            data);
    }
    saveDepartment(payload): Observable<any> {
        return this.apiService.post(this.saveDepartmentQuery, payload).map(data => data);
    }
}
