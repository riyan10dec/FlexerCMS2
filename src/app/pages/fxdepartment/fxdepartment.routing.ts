import { Routes, RouterModule } from '@angular/router';

import { FXDepartmentComponent } from './fxdepartment.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: FXDepartmentComponent,
  },
];

export const routing = RouterModule.forChild(routes);
