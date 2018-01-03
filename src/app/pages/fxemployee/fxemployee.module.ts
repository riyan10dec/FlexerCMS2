import { EmployeeStructureComponent } from '../employee-structure/employee-structure.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
 import { FXEmployeeComponent } from './fxemployee.component';
 import { routing } from './fxemployee.routing';
import { SmartTableService } from '../../@core/data/smart-table.service';
 import { FXEmployeeService } from './fxemployee.service';
 import { ApiService } from '../../shared/apiService';
 import { JwtService } from '../../shared/jwt.service';
import {MomentModule} from 'angular2-moment';
 import { NguiAutoCompleteModule } from '@ngui/auto-complete';
 import {DpDatePickerModule} from 'ng2-date-picker';
import { ChartModule } from 'angular2-chartjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularEchartsModule } from 'ngx-echarts';
import { PerformanceComponent } from '../performance/performance.component'
import { ToasterModule } from 'angular2-toaster';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  imports: [
    NguiAutoCompleteModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ThemeModule,
    routing,
    Ng2SmartTableModule,
    MomentModule,
    DpDatePickerModule,
    ChartModule,
    NgxChartsModule,
    AngularEchartsModule,
    ToasterModule,
    TreeModule,
  ],
  declarations: [
    FXEmployeeComponent,
    PerformanceComponent,
    EmployeeStructureComponent,
  ],
  providers: [
    SmartTableService,
    FXEmployeeService,
    ApiService,
    JwtService,
  ],
})
export class FXEmployeeModule {
  constructor() {
  }
}
