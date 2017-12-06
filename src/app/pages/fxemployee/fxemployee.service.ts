import { ApiService } from '../../shared/apiService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class FXEmployeeService {
    constructor(private apiService: ApiService) { }

    private getEmployeeDataQuery: string = '/cms/GetSubs/@0/@1/@2';
    private editEmployeeQuery: string = '/cms/editEmployee';
    private addEmployeeQuery: string = '/cms/addEmployee';
    private getActiveDepartment: string = '/cms/GetActiveDepartments/@0';
    private getPositionsQuery: string = '/cms/GetAllPositions/@0';
    private getSuperiorsQuery: string = '/cms/GetSubs/@0/@1/@2';

    getEmployeeData(payload): Observable<any> {
        return this.apiService.get(this.getEmployeeDataQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.gmtDiff)
        .replace('@2', payload.activeOnly)).map(data =>
            data);
    }
    editEmployee(payload): Observable<any> {
        return this.apiService.post(this.editEmployeeQuery, payload).map(data => data);
    }
    addEmployee(payload): Observable<any> {
        return this.apiService.post(this.addEmployeeQuery, payload).map(data => data);
    }
    getActiveDepartments(payload): Observable<any> {
        return this.apiService.get(this.getActiveDepartment
        .replace('@0', payload)).map(data =>
            data);
    }
    getPositions(payload): Observable<any> {
        return this.apiService.get(this.getPositionsQuery
        .replace('@0', payload)).map(data =>
            data);
    }

    getSuperiors(payload): Observable<any> {
        return this.apiService.get(this.getSuperiorsQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.gmtDiff)
        .replace('@2', payload.activeOnly)).map(data =>
            data);
    }
}
