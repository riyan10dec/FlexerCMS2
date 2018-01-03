import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
 import { EmployeeStructureComponent } from './employee-structure.component';
 import { EmployeeStructureService } from './employee-structure.service';
 import { ApiService } from '../../shared/apiService';
 import { JwtService } from '../../shared/jwt.service';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ThemeModule,
  ],
  declarations: [
    EmployeeStructureComponent,
  ],
  providers: [
    EmployeeStructureService,
    ApiService,
    JwtService,
  ],
})
export class EmployeeStructureModule {
  constructor() {
  }
}
