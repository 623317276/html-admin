import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReimbursementRoutingModule } from './reimbursement-routing.module';
import { ReimbursementComponent } from './reimbursement.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonServiceModule } from '../../common-service/common-service.module';


@NgModule({
  declarations: [ReimbursementComponent],
  imports: [
    CommonModule,
    ReimbursementRoutingModule,NgZorroAntdModule,ReactiveFormsModule,FormsModule,
    CommonServiceModule
  ]
})
export class ReimbursementModule { }
