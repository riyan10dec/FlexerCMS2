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
declare var swal: any;

@Component({
  selector: 'fxemployee',
  template: `<router-outlet></router-outlet>`,
  templateUrl: './fxemployee.html',
  styleUrls: ['./fxemployee.scss'],
  providers: [FXEmployeeService],
})
export class FXEmployeeComponent implements OnInit {

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
      employeeName: {
        title: 'Employee Name',
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
  private initEmployee: any;
  selectedAction: string;
  selectedRows: any;
  private changedEmployee: any;
  constructor( private fxEmployeeService: FXEmployeeService,
  private _sanitizer: DomSanitizer, private employeeService: FXEmployeeService) {
    this.selectedAction = '';
    this.changedEmployee = [];
    const payload = {
      clientID: 1,
      gmtDiff: new Date().getTimezoneOffset() / 60 * -1,
    };
    this.employeeService.getEmployeeData(payload).subscribe((data) => {
      this.initEmployee = data.employees;
      const tempEmployee: any = [];
      data.employees.forEach(d => {
        const cb: CheckboxRenderComponent = new CheckboxRenderComponent();
        if (d.selected === 1) {
          cb.setMarked(true);
        } else {
          cb.setMarked(false);
        }
        tempEmployee.push({
          checkbox: cb,
          employeeName: d.employeeName,
          employeeCount: d.employeeCount,
        });
      });
      this.source.load(tempEmployee);
    });

  }
  applyAction(action: string): void {
    if (action === 'bulkDelete') {
      this.source.getAll().then(d => {
        const deletedElements = [];
        let successDelete = true;
        d.forEach((element, i, obj) => {
          this.selectedRows.forEach((element2, j, obj2) => {
            if (element.employeeName === element2.employeeName) {
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
            'You can\'t delete Employee with assigned employee!',
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
      const oldEmployeeNames = [];
      const newEmployeeNames = [];
      d.forEach(function(item) {
        tempDept.push(item.employeeName);
      });
      this.changedEmployee.forEach(function (item) {
        oldEmployeeNames.push(item.old);
        newEmployeeNames.push(item.new);
      });
      const params = {
        clientID : 1,
        employeeList : tempDept,
        oldEmployeeNames,
        newEmployeeNames,
        entryBy : 1,
      };
      this.employeeService.saveEmployee(params).subscribe((data) => {
        if (data.status === 1) {
          swal(
            ':)',
            'Your Employee sucessfully saved!',
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
            'You can\'t delete Employee with assigned employee!',
            'error',
          );
          event.confirm.revert();
        } else {
          event.confirm.resolve();
        }
    });
  }
  onEditConfirm(event): void {
      this.changedEmployee.push({
        old: event.data.employeeName,
        new: event.newData.employeeName,
      });
      event.confirm.resolve();
  }
  onCreateConfirm(event): void {
    this.source.getAll().then(d => {
    let employeeExist = false;
    d.forEach(element => {
      if (element.employeeName === event.newData.employeeName) {
        employeeExist = true;
      }
    });
    if (employeeExist) {
      swal(
        'Oops...',
        'Employee ' + event.newData.employeeName + ' already exist!',
        'error',
      );
      event.confirm.revert();
    } else if (event.newData.employeeName === undefined || event.newData.employeeName.trim().length === 0) {
      swal(
        'Oops...',
        'You can\'t save empty Employee!',
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
