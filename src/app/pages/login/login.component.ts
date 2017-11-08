import { filter } from 'rxjs/operator/filter';
import { withIdentifier } from 'codelyzer/util/astQuery';
import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { CheckboxRenderComponent } from '../../shared/checkbox-render.component';
import { Router } from '@angular/router';

declare var swal: any;

@Component({
  selector: 'login',
  template: `<router-outlet></router-outlet>`,
  templateUrl: './login.html',
  styleUrls: ['./login.style.scss'],
  providers: [LoginService],
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  constructor( private loginService: LoginService, private router: Router) {
      
  }
  ngOnInit() {}
  signIn() {
    let param = {
      email: this.email,
      password: this.password,
      gmtDiff: parseFloat(this.getTimezoneOffset().toFixed(2)),
    };
    this.loginService.signIn(param).subscribe((data) => {
      if (data.status === 1) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('serverTime', data.serverTime);
        this.router.navigateByUrl('/pages/dashboard');
      } else {
        swal(
            'Oops...',
            data.description,
            'error');
      }
    });
  }
   getTimezoneOffset() {
      let offset = new Date().getTimezoneOffset();
      offset = Math.abs(offset);
      return offset / 60;
  }

}
