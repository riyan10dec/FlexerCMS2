import { Routes, RouterModule } from '@angular/router';

import { ActivityCategoryComponent } from './activity.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ActivityCategoryComponent,
  },
];

export const routing = RouterModule.forChild(routes);
