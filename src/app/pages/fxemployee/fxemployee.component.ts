import { Router } from '@angular/router';
import { ButtonViewComponent } from '../../shared/button-render.component';
import { NbThemeService } from '@nebular/theme';
import { ProtractorExpectedConditions } from 'protractor/built/expectedConditions';
import { filter } from 'rxjs/operator/filter';
import { withIdentifier } from 'codelyzer/util/astQuery';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
// import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { FXEmployee } from './fxemployee';
import { FXEmployeeService } from './fxemployee.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { CheckboxRenderComponent } from '../../shared/checkbox-render.component';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

import 'style-loader!angular2-toaster/toaster.css';
import * as moment from 'moment';
declare var $: any;
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
  providers: [FXEmployeeService, ToasterService],
})

export class FXEmployeeComponent implements OnInit {

  protected viewPerformance: boolean;
  protected viewStructure: boolean = false;
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
      deleteButtonContent: '<i class="fa fa-line-chart" aria-hidden="true" style="font-size: 18px;"></i>',
      confirmDelete: true,
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
  protected inActiveDate: Date;
  protected edit: boolean;
  protected selectedDepartment: string;
  protected departments: any;
  protected positions: any;
  protected superiors: any;
  protected enableReset: boolean;
  protected changedEmployee: FXEmployee;
  protected activeOnly: boolean;
  protected oldEmployee: FXEmployee;
  protected isNew: boolean;
  ngOnInit() {
    this.configToast = new ToasterConfig({
            positionClass: 'toast-bottom-right',
            timeout: 5000,
            newestOnTop: true,
            tapToDismiss: true,
            preventDuplicates: true,
            animation: 'flyRight',
            limit: 5,
        });
  }
  constructor(private fxEmployeeService: FXEmployeeService,
    private _sanitizer: DomSanitizer, private employeeService: FXEmployeeService,
    private router: Router, private toasterService: ToasterService) {
    this.viewPerformance = false;
    this.inActiveDate = new Date();
    this.enableReset = false;
    this.superiors = [];
    this.selectedAction = '';
    this.activeOnly = false;
    this.changedEmployee = new FXEmployee();
    const payload = {
      userID: localStorage.getItem('userID'),
      gmtDiff: parseFloat(localStorage.getItem('gmtDiff')),
      activeOnly: this.activeOnly,
    };
    this.loadEmployeeGrid();
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
          id: parseInt(localStorage.getItem('userID'), 10),
          name: localStorage.getItem('userName'),
        });
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
  toggleReset() {
    if (this.enableReset === true) {
      this.enableReset = false;
      this.changedEmployee.NewPassword = 'Password';
    } else {
      this.enableReset = true;
      this.changedEmployee.NewPassword = '';
    }
  }
  loadEmployeeGrid() {
    const payload = {
      userID: localStorage.getItem('userID'),
      gmtDiff: parseFloat(localStorage.getItem('gmtDiff')),
      activeOnly: this.activeOnly,
    }
    this.employeeService.getEmployeeData(payload).subscribe((data) => {
      data.employees.forEach( d => {
        if (d.lastActivity.length === 0) {
          return;
        }
        d.lastActivity = moment(d.lastActivity, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY HH:mm:ss');
      });
      this.source.load(data.employees);
    });
  }
  onCreate() {
    this.edit = true;
    this.enableReset = false;
    this.isNew = true;
    this.changedEmployee = new FXEmployee();
    this.changedEmployee.Status = 'Active';
    this.oldEmployee = this.changedEmployee;
  }
  onEdit(event) {
    this.edit = true;
    this.isNew = false;
    this.enableReset = false;
    this.changedEmployee.Department = event.data.departmentName;
    this.changedEmployee.Email = event.data.email;
    this.changedEmployee.EmployeeID = event.data.employeeID;
    this.changedEmployee.EmployeeName = event.data.userName;
    this.changedEmployee.LastActivity = event.data.lastActivity;
    this.changedEmployee.Position = event.data.positionName;
    this.changedEmployee.Status = event.data.activeStatus;
    this.changedEmployee.UserID = event.data.userID;
    this.changedEmployee.Superior = {
      id: event.data.superiorID,
      name: event.data.superiorName,
    }
    this.changedEmployee.ActiveStart = event.data.activeStart;
    this.changedEmployee.ActiveEnd = event.data.activeEnd;
    //
    for (let i = 0; i < this.superiors.length; ++i) {
      if (this.superiors[i].id === event.data.userID) {
        this.superiors.splice(i--, 1);
      }
    }
    this.oldEmployee = this.changedEmployee;
  }
  autocompleListFormatterSuperior = (data: any) => {
    const html = `<span class="nb-theme-cosmic">${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
  saveProfile() {
    const payload = this.generatePayloadEmployee(this.changedEmployee);
    if (this.isNew) {
      this.employeeService.addEmployee(payload).subscribe(
        (data) => {
          swal('success', 'Success add employee');
          this.edit = false;
        });
    } else {
      this.employeeService.editEmployee(payload).subscribe(
        (data) => {
          swal('success', 'Success update employee');
        });
    }
  }
  activate(active: boolean, inActiveDate: Date) {
    if (active === true) {
      this.oldEmployee.ActiveStart = new Date();
      this.oldEmployee.Status = 'Active';
      const payload = this.generatePayloadEmployee(this.oldEmployee);
      this.employeeService.editEmployee(payload).subscribe(
        (data) => {
          swal('success', 'Success activate employee');
          this.changedEmployee.ActiveStart = this.changedEmployee.ActiveStart;
          this.changedEmployee.Status = 'Active';
        });
    } else {
      this.oldEmployee.ActiveEnd = this.inActiveDate;
      this.oldEmployee.Status = 'Inactive';
      const payload = this.generatePayloadEmployee(this.oldEmployee);
      this.employeeService.editEmployee(payload).subscribe(
        (data) => {
          swal('success', 'Success deactivate employee');
          this.changedEmployee.ActiveEnd = this.changedEmployee.ActiveEnd;
          if (this.changedEmployee.ActiveEnd < new Date()) {
            this.changedEmployee.Status = 'Inactive';
          }
        });
    }
  }
  showInactiveDate() {
    swal({
      title: 'Date picker',
      html: '<div id="datepicker" name="InActiveDatepicker"></div>',
      onOpen: function () {
        $('#datepicker').datepicker();
      },
      preConfirm: function () {
        return Promise.resolve($('#datepicker').datepicker('getDate'));
      },
      customClass: 'datepicker',
    }).then((result) => {
      this.inActiveDate = result;
      this.activate(false, this.inActiveDate);
    });
  }
  generatePayloadEmployee(emp: FXEmployee) {
    return {
      userID: emp.UserID,
      employeeID: emp.EmployeeID,
      userName: emp.EmployeeName,
      positionName: emp.Position,
      departmentName: emp.Department,
      superiorID: emp.Superior.id,
      email: emp.Email,
      clientID: parseInt(localStorage.getItem('clientID'), 10),
      userPassword: this.enableReset === true ? emp.NewPassword : '',
      activeStatus: emp.Status,
      activeStart: moment(emp.ActiveStart).format('YYYY-MM-DD'),
      activeEnd: moment(emp.ActiveEnd).format('YYYY-MM-DD'),
      modifiedBy: parseInt(localStorage.getItem('userID'), 10),
      gmtDiff: parseFloat(localStorage.getItem('gmtDiff')),
    };
  }

  resetPassword() { }
  onPositionChanged(event) {
    this.changedEmployee.Position = event;
  }

  onDepartmentChanged(event) {
    this.changedEmployee.Department = event;
  }

  departmentFormatter = (data: any) => {
    const html = `<span style='color:red'>${data} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
  protected performanceUserID: number;
  onPerformance(event) {
    this.performanceUserID = event.data.userID;
    this.viewPerformance = true;
    if (localStorage.getItem('performanceNotification') == null) {
        this.showToast('info', '', 'Select on bar!');
        localStorage.setItem('performanceNotification', 'true');
    }
  }

    protected configToast: any;
    private showToast(type: string, title: string, body: string) {
        const toast: Toast = {
            type: type,
            title: title,
            body: body,
            timeout: 5000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.pop(toast);
    }
}
