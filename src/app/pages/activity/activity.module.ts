import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { ActivityComponent } from './activity.component';
import { routing } from './activity.routing';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { ActivityService } from './activity.service';
import { ApiService } from '../../shared/apiService';
import { JwtService } from '../../shared/jwt.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ThemeModule,
    routing,
    Ng2SmartTableModule,
    NguiAutoCompleteModule,
    NgbModule,
  ],
  declarations: [
    ActivityComponent,
  ],
  providers: [
    SmartTableService,
    ActivityService,
    ApiService,
    JwtService,
  ],
})
export class ActivityModule {
  constructor() {
  }
}
