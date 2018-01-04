import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
 import { ActivityCategoryComponent } from './activity.component';
 import { routing } from './activity.routing';
import { SmartTableService } from '../../@core/data/smart-table.service';
 import { ActivityCategoryService } from './activity.service';
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
    ActivityCategoryComponent,
  ],
  providers: [
    SmartTableService,
    ActivityCategoryService,
    ApiService,
    JwtService,
  ],
  // entryComponents: [
  //   CheckboxRenderComponent,
  // ],
})
export class ActivityCategoryModule { 
  constructor() {
  console.log('a');
  }
}
