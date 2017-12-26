import { ApiService } from '../../shared/apiService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class PerformanceService {
    constructor(private apiService: ApiService) { }

    private getUserPerformanceQuery: string = '/cms/GetUserPerformance/@0/@1/@2';
    private getUserDailyQuery: string = '/cms/GetUserDaily/@0/@1/@2/@3';
    private getUserTasksQuery: string = '/cms/GetUserTasks/@0/@1/@2/@3';
    private getUserDailyActivityQuery: string = '/cms/GetUserDailyActivity/@0/@1/@2';
    private getUserDailyTimelineQuery: string = '/cms/GetUserDailyTimeline/@0/@1';

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
    getUserDailyActivity(payload): Observable<any> {
        return this.apiService.get(this.getUserDailyActivityQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.periodStart)
        .replace('@2', payload.periodEnd)).map(data =>
            data);
    }
    getUserDailyTimeline(payload): Observable<any> {
        return this.apiService.get(this.getUserDailyTimelineQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.sessionDate)).map(data =>
            data);
    }
    getUserTask(payload): Observable<any> {
        return this.apiService.get(this.getUserTasksQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.periodStart)
        .replace('@2', payload.periodEnd)
        .replace('@3', payload.isOngoingOnly)).map(data =>
            data);
    }
}
