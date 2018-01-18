import { Activity } from './activity';
import { ApiService } from '../../shared/apiService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ActivityService {
    constructor(private apiService: ApiService) { }

    private getActivityQuery: string = '/cms/GetAllActivities/@0/@1';
    private getCategoryQuery: string = '/cms/GetAllCategory/@0';
    private saveActivityQuery: string = '/cms/SaveActivity';

    getActivity(payload): Observable<any> {
        return this.apiService.get(this.getActivityQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.gmtDiff)).map(data =>
            data);
    }
    saveActivity(payload): Observable<any> {
        return this.apiService.post(this.saveActivityQuery, payload).map(data => data);
    }

    getAllCategory(payload): Observable<any> {
        return this.apiService.get(this.getCategoryQuery
        .replace('@0', payload.userID)
        .replace('@1', payload.gmtDiff)).map(data =>
            data);
    }
}
