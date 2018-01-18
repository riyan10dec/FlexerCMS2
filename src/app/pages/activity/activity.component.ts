import { elementAt } from 'rxjs/operator/elementAt';
import { NbSpinnerService } from '@nebular/theme';
import { ClassificationColor } from '../../shared/color';
import { fdatasync } from 'fs';
import { filter } from 'rxjs/operator/filter';
import { withIdentifier } from 'codelyzer/util/astQuery';
import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
// import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { Activity } from './activity';
import { ActivityService } from './activity.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { CheckboxRenderComponent } from '../../shared/checkbox-render.component';
declare var swal: any;

@Component({
  selector: 'ngx-activity',
  template: `<router-outlet></router-outlet>`,
  templateUrl: './activity.html',
  styleUrls: ['./activity.scss'],
  providers: [ActivityService],
})
export class ActivityComponent {
  protected activities: any;
  protected totalUtil: number;
  protected categories: any;
  constructor( private fxDepartmentService: ActivityService,
  private _sanitizer: DomSanitizer, private activityService: ActivityService,
  private _spinner: NbSpinnerService) {
    const payload = {
      userID: localStorage.getItem('userID'),
      gmtDiff: parseFloat(localStorage.getItem('gmtDiff')),
    };
    this._spinner.registerLoader(this.activityService.getActivity(payload).toPromise().then((data) => {
      this.activities = data.activities;
      this.totalUtil = data.activities[0].utilization;
    }));

    this._spinner.load();
  }
  applyAction(action: string): void {
   
  }
  protected changedActivity: any = new Array();
  onSubmit(): void {

    this.changedActivity.forEach(element => {
      const payload = {
        userID: parseInt(localStorage.getItem('userID'), 10),
        activityName: element.activityName,
        activityType: element.activityType,
        category: element.category,
        classification: element.classification,
      };
      this._spinner.registerLoader(this.activityService.saveActivity(payload).toPromise().then(data => {

      }));
    });
    this._spinner.load();
  }
  onChange(type, event, item): void {
    this.changedActivity.forEach(element => {
      if (element.activityName === item.activityName) {
        return;
      }
    });
    if (type === 'category') {
      item.category = event.target.value;
    }
    if (type === 'classification') {
      item.classification = event.target.value;
    }
    this.changedActivity.push(item);
  }
  getColor(item: any) {
    if (item.classification === 'Productive') {
      return ClassificationColor.productive;
    }
    if (item.classification === 'Unproductive') {
      return ClassificationColor.unproductive;
    }
    return ClassificationColor.unclassified;
  }
}
