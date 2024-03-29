import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule } from '@angular/forms';

import { CommonServiceModule } from '../../common-service/common-service.module';

@NgModule({
  declarations: [LoginComponent,LoginFormComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,NgZorroAntdModule,ReactiveFormsModule,
		CommonServiceModule
  ]
})
export class LoginModule { }
