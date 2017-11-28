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
  ],
  declarations: [
    FXEmployeeComponent,
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
