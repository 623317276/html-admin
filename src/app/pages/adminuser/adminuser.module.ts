import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminuserRoutingModule } from './adminuser-routing.module';
import { AdminuserComponent } from './adminuser.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonServiceModule } from '../../common-service/common-service.module';

@NgModule({
  declarations: [AdminuserComponent],
  imports: [
    CommonModule,
    AdminuserRoutingModule,
    NgZorroAntdModule,ReactiveFormsModule,FormsModule,
    CommonServiceModule
  ]
})
export class AdminuserModule { }
