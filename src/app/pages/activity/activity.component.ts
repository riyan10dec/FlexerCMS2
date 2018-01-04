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
  selector: 'activity',
  template: `<router-outlet></router-outlet>`,
  templateUrl: './activity.html',
  styleUrls: ['./activity.scss'],
  providers: [ActivityService],
})
export class ActivityComponent implements OnInit {

  source: LocalDataSource = new LocalDataSource();
  public input: string = '<input type="checkbox"></input>';
  settings = {
    // editable: false,
    selectMode: 'multi',
    // mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions : {
      // delete: false,
    },
    columns: {
      // checkbox: {
      //   title: '',
      //   type: 'custom',
      //   renderComponent: CheckboxRenderComponent,
      //   // onComponentInitFunction(instance) {
      //   //   instance.save.subscribe(row => {
      //   //     alert(`${row.name} saved!`)
      //   //   });
      //   // },
      //   //valuePrepareFunction: (value) => { return this.input
      // /*this._sanitizer.bypassSecurityTrustHtml(this.input);*/ },
      //   filter: false,
      // },
      departmentName: {
        title: 'Department Name',
        type: 'string',
        filter: false,
      },
      employeeCount: {
        defaultValue: '0',
        title: 'Employee',
        type: 'number',
        filter: false,
        editable: false,
        width: '20',
      },
    },
  };
  private initDepartment: any;
  selectedAction: string;
  selectedRows: any;
  private changedDepartment: any;
  constructor( private fxDepartmentService: ActivityService,
  private _sanitizer: DomSanitizer, private departmentService: ActivityService) {
    this.selectedAction = '';
    this.changedDepartment = [];
    const payload = {
      clientID: 1,
      gmtDiff: new Date().getTimezoneOffset() / 60 * -1,
    };
    this.departmentService.getDepartmentData(payload).subscribe((data) => {
      this.initDepartment = data.departments;
      const tempDepartment: any = [];
      data.departments.forEach(d => {
        const cb: CheckboxRenderComponent = new CheckboxRenderComponent();
        if (d.selected === 1) {
          cb.setMarked(true);
        } else {
          cb.setMarked(false);
        }
        tempDepartment.push({
          checkbox: cb,
          departmentName: d.departmentName,
          employeeCount: d.employeeCount,
        });
      });
      this.source.load(tempDepartment);
    });

  }
  applyAction(action: string): void {
    if (action === 'bulkDelete') {
      this.source.getAll().then(d => {
        const deletedElements = [];
        let successDelete = true;
        d.forEach((element, i, obj) => {
          this.selectedRows.forEach((element2, j, obj2) => {
            if (element.departmentName === element2.departmentName) {
              if (element.employeeCount > 0) {
                successDelete = false;
              }
              deletedElements.push(element);
            }
          });
        });
        if (!successDelete) {
          swal(
            'Oops...',
            'You can\'t delete Department with assigned employee!',
            'error',
          );
        } else {
          deletedElements.forEach(element => {
            this.source.remove(element);
          });
        }
      });
    } else if (action === 'import') {

    }
  }
  onSubmit(values: Object): void {
    this.source.getAll().then( d => {
      const tempDept = [];
      const oldDepartmentNames = [];
      const newDepartmentNames = [];
      d.forEach(function(item) {
        tempDept.push(item.departmentName);
      });
      this.changedDepartment.forEach(function (item) {
        oldDepartmentNames.push(item.old);
        newDepartmentNames.push(item.new);
      });
      const params = {
        clientID : 1,
        departmentList : tempDept,
        oldDepartmentNames,
        newDepartmentNames,
        entryBy : 1,
      };
      this.departmentService.saveDepartment(params).subscribe((data) => {
        if (data.status === 1) {
          swal(
            ':)',
            'Your Department sucessfully saved!',
            'success',
          );
        } else {

        }
      });
    });
  }
  onChecked(e) {
    this.selectedRows = e.selected;
  }
  onDeleteConfirm(event): void {
    swal({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(function() {
        if (event.data.employeeCount > 0) {
          swal(
            'Oops...',
            'You can\'t delete Department with assigned employee!',
            'error',
          );
          event.confirm.revert();
        } else {
          event.confirm.resolve();
        }
    });
  }
  onEditConfirm(event): void {
      this.changedDepartment.push({
        old: event.data.departmentName,
        new: event.newData.departmentName,
      });
      event.confirm.resolve();
  }
  onCreateConfirm(event): void {
    this.source.getAll().then(d => {
    let departmentExist = false;
    d.forEach(element => {
      if (element.departmentName === event.newData.departmentName) {
        departmentExist = true;
      }
    });
    if (departmentExist) {
      swal(
        'Oops...',
        'Department ' + event.newData.departmentName + ' already exist!',
        'error',
      );
      event.confirm.revert();
    } else if (event.newData.departmentName === undefined || event.newData.departmentName.trim().length === 0) {
      swal(
        'Oops...',
        'You can\'t save empty Department!',
        'error',
      );
      event.confirm.revert();
    } else {
      event.confirm.resolve();
    }
     });
  }
  ngOnInit() {}
  ngAfterViewInit() {
    document.getElementsByClassName('employeeCount')['0'].style.width = '100px';
    document.getElementsByClassName('ng2-smart-actions')['0'].style.width = '50px';
     // document.getElementsByClassName('ng2-smart-action-multiple-select')['2'].style.padding = '0.875rem 1.25rem;';
  }
}
