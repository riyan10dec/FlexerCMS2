import { ApiService } from '../../shared/apiService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class PerformanceService {
    constructor(private apiService: ApiService) { }

    private getUserPerformanceQuery: string = '/cms/GetUserPerformance/@0/@1/@2';
    private getUserDailyQuery: string = '/cms/GetUserDaily/@0/@1/@2/@3';

    getUserPerformance(payload): Observable<any> {
        return this.apiService.get(this.getUserPerformanceQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.periodStart)
        .replace('@2', payload.periodEnd)).map(data =>
            data);
    }
    getUserDaily(payload): Observable<any> {
        return this.apiService.get(this.getUserDailyQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.periodStart)
        .replace('@2', payload.periodEnd)
        .replace('@3', payload.numOfResult)).map(data =>
            data);
    }
}
