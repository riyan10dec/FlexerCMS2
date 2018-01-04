import { Activity } from './activity';
import { ApiService } from '../../shared/apiService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ActivityService {
    constructor(private apiService: ApiService) { }

    private getActivityQuery: string = '/cms/GetAllActivities/@0/@1';
    private updateActivityQuery: string = '/cms/UpdateActivity';

    getActivity(payload): Observable<any> {
        return this.apiService.get(this.getActivityQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.gmtDiff)).map(data =>
            data);
    }
    saveDepartment(payload): Observable<any> {
        return this.apiService.post(this.updateActivityQuery, payload).map(data => data);
    }
}
