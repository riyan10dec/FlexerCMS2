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

  source: LocalDataSource = new LocalDataSource();
  public input: string = '<input type="checkbox"></input>';
  settings = {
    selectMode: 'multi',
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    actions : {
       delete: false,
       add: false,
    },
    hideSubHeader: true,
    columns: {
      activityName: {
        title: 'Activity Name',
        type: 'string',
      },
      activityType: {
        title: 'Employee',
        type: 'string',
      },
      category: {
        title: 'Category',
        type: 'string',
      },
      classification: {
        title: 'Classification',
        type: 'string',
      },
      utilization: {
        title: 'Utilization',
        type: 'string',
      },
    },
  };
  constructor( private fxDepartmentService: ActivityService,
  private _sanitizer: DomSanitizer, private activityService: ActivityService) {
    const payload = {
      userID: localStorage.getItem('userID'),
      gmtDiff: parseFloat(localStorage.getItem('gmtDiff')),
    };
    this.activityService.getActivity(payload).subscribe((data) => {
      this.source.load(data);
    });

  }
  applyAction(action: string): void {
   
  }
  

  onEditConfirm(event): void {
      event.confirm.resolve();
  }
}
