import { Routes, RouterModule } from '@angular/router';

import { FXEmployeeComponent } from './fxemployee.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: FXEmployeeComponent,
  },
];

export const routing = RouterModule.forChild(routes);
