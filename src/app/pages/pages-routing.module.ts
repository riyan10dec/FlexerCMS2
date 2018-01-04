import { PerformanceComponent } from './performance/performance.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  //canActivate: [AuthGuard],
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    }, {
    //   path: 'ui-features',
    //   loadChildren: './ui-features/ui-features.module#UiFeaturesModule',
    // }, {
    //   path: 'components',
    //   loadChildren: './components/components.module#ComponentsModule',
    // }, {
    //   path: 'maps',
    //   loadChildren: './maps/maps.module#MapsModule',
    // }, {
    //   path: 'charts',
    //   loadChildren: './charts/charts.module#ChartsModule',
    // }, {
    //   path: 'editors',
    //   loadChildren: './editors/editors.module#EditorsModule',
    // }, {
    //   path: 'forms',
    //   loadChildren: './forms/forms.module#FormsModule',
    // }, {
    //   path: 'tables',
    //   loadChildren: './tables/tables.module#TablesModule',
    // }, {
      path: 'fxdepartment',
      loadChildren: './fxdepartment/fxdepartment.module#FXDepartmentModule',
    },
    {
      path: 'fxemployee',
      loadChildren: './fxemployee/fxemployee.module#FXEmployeeModule',
    },
    {
      path: 'ActivityCategory',
      loadChildren: './activity/activity.module#ActivityModule',
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
