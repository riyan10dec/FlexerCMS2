import { ProtractorExpectedConditions } from 'protractor/built/expectedConditions';
import { filter } from 'rxjs/operator/filter';
import { withIdentifier } from 'codelyzer/util/astQuery';
import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
// import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { FXEmployee } from './fxemployee';
import { FXEmployeeService } from './fxemployee.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { CheckboxRenderComponent } from '../../shared/checkbox-render.component';
import * as moment from 'moment';
declare var swal: any;
@Component({
  selector: 'fxemployee',
  template: `<router-outlet></router-outlet>`,
  templateUrl: './fxemployee.html',
  styles: [
    `ngui-auto-complete {
        width: 500px !important;
        position: absolute;
        left: 10px !important;
        top: 10px !important;
    }`,
  ],
  providers: [FXEmployeeService],
})
export class FXEmployeeComponent {

  source: LocalDataSource = new LocalDataSource();
  public input: string = '<input type="checkbox"></input>';
  settings = {
     mode: 'external',
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
      userName: {
        title: 'Employee',
        type: 'string',
        filter: false,
      },
      positionName: {
        title: 'Position',
        type: 'string',
        filter: false,
      },
      departmentName: {
        title: 'Department',
        type: 'string',
        filter: false,
      },
      activeStatus: {
        title: 'Status',
        type: 'string',
        filter: false,
      },
      lastActivity: {
        title: 'Last Activity',
        type: 'string',
        filter: false,
      },
    },
  };
  private initEmployee: any;
  selectedAction: string;
  selectedRows: any;
  protected edit: boolean;
  protected selectedDepartment: string;
  protected departments: any;
  protected positions: any;
  protected superiors: any;
  protected enableReset: boolean;
  protected changedEmployee: FXEmployee;
  constructor( private fxEmployeeService: FXEmployeeService,
  private _sanitizer: DomSanitizer, private employeeService: FXEmployeeService) {
    this.superiors = [];
    this.selectedAction = '';
    this.changedEmployee = new FXEmployee();
    const payload = {
      userID: localStorage.getItem('userID'),
      gmtDiff: parseFloat(localStorage.getItem('gmtDiff')),
      activeOnly: true,
    };
    this.employeeService.getEmployeeData(payload).subscribe((data) => {
      data.employees.forEach( d => {
        if (d.lastActivity.length == 0) return;
        d.lastActivity = moment(d.lastActivity, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY HH:mm:ss');
      });
      this.source.load(data.employees);
    });
    this.employeeService.getActiveDepartments(localStorage.getItem('clientID')).subscribe(
      (data) => {
        this.departments = data.departments;
      });

    this.employeeService.getPositions(localStorage.getItem('clientID')).subscribe(
      (data) => {
        this.positions = data.positions;
      });

    this.employeeService.getSuperiors(payload).subscribe(
      (data) => {
        data.employees.forEach(element => {
          this.superiors.push({
            id: element.userID,
            name: element.userName,
          });
        });
        this.superiors.push({
          id: parseInt(localStorage.getItem('userID')),
          name: localStorage.getItem('userName'),
        });
        console.log(this.superiors);
      });

    // this.employeeService.getPositions(localStorage.getItem('clientID')).subscribe(
    //   (data) => {
    //     this.departments = data.departments;
    //   });
    this.edit = false;
  }
  setDepartment(department) {
    this.departments = department;
  }
  onEdit(event) {
    this.edit = true;
    this.changedEmployee.Department = event.data.departmentName;
    this.changedEmployee.Email = event.data.email;
    this.changedEmployee.EmployeeID = event.data.employeeID;
    this.changedEmployee.EmployeeName = event.data.userName;
    this.changedEmployee.LastActivity = event.data.lastActivity;
    this.changedEmployee.Position = event.data.positionName;
    this.changedEmployee.Status = event.data.activeStatus;
    this.changedEmployee.UserID = event.data.userID;
    this.changedEmployee.Superior = {
      id : event.data.superiorID,
      name: event.data.superiorName,
    };
    //
    for (let i = 0; i < this.superiors.length; ++i) {
      if (this.superiors[i].id === event.data.userID) {
          this.superiors.splice( i--, 1);
      }
    }
  }
  autocompleListFormatterSuperior = (data: any) => {
    let html = `<span class="nb-theme-cosmic">${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
  saveProfile() {

  }
  activate(active: boolean) {
    console.log(this.changedEmployee);
  }
  resetPassword() { }

  departmentFormatter = (data: any) => {
    let html = `<span style='color:red'>${data} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
}
