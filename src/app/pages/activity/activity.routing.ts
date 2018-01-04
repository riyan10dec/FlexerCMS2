import { Routes, RouterModule } from '@angular/router';

import { ActivityComponent } from './activity.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ActivityComponent,
  },
];

export const routing = RouterModule.forChild(routes);
