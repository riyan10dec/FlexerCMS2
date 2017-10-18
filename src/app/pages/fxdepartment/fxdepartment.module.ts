import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
 import { FXDepartmentComponent } from './fxdepartment.component';
 import { routing } from './fxdepartment.routing';
import { SmartTableService } from '../../@core/data/smart-table.service';
 import { FXDepartmentService } from './fxdepartment.service';
 import { ApiService } from '../../shared/apiService';
 import { JwtService } from '../../shared/jwt.service';
// import { CheckboxRenderComponent } from '../../shared/checkbox-render.component';
// import { connectionAPI } from '../../../environments/connectionAPI';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ThemeModule,
    routing,
    Ng2SmartTableModule,
  ],
  declarations: [
    FXDepartmentComponent,
  ],
  providers: [
    SmartTableService,
    FXDepartmentService,
    ApiService,
    JwtService,
  ],
  // entryComponents: [
  //   CheckboxRenderComponent,
  // ],
})
export class FXDepartmentModule { 
  constructor() {
  console.log('a');
  }
}
