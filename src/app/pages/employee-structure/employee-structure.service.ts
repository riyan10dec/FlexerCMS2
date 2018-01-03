import { ApiService } from '../../shared/apiService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class EmployeeStructureService {
    constructor(private apiService: ApiService) { }
    private changeSuperiorquery: string = '/cms/EmployeeTree/ChangeSuperior';
    private loadFirstQuery: string =  '/cms/EmployeeTree/first/@0/@1/@2';
    private loadSubsQuery: string =  '/cms/EmployeeTree/child/@0/@1/@2';

    changeSuperior(payload): Observable<any> {
        return this.apiService.post(this.changeSuperiorquery, payload)
        .map(data => data);
    }
    loadFirst(payload): Observable<any> {
        return this.apiService.get(this.loadFirstQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.isActiveOnly)
        .replace('@2', payload.gmtDiff)).map(data =>
            data);
    }

    loadSubs(payload): Observable<any> {
        return this.apiService.get(this.loadSubsQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.isActiveOnly)
        .replace('@2', payload.gmtDiff)).map(data =>
            data);
    }
}
