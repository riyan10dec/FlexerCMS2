import { LoginService } from './login.service';
import { LoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAuthModule, NbDummyAuthProvider } from '@nebular/auth';

import { ThemeModule } from '../../@theme/theme.module';
 import { ApiService } from '../../shared/apiService';
 import { JwtService } from '../../shared/jwt.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ThemeModule,
    NbAuthModule,
  ],
  declarations: [
    LoginComponent,
  ],
  providers: [
    LoginService,
    ApiService,
    JwtService,
  ],
  // entryComponents: [
  //   CheckboxRenderComponent,
  // ],
})
export class LoginModule {
  constructor() {
  }
}
