import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsumptionRoutingModule } from './consumption-routing.module';
import { ConsumptionComponent } from './consumption.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonServiceModule } from '../../common-service/common-service.module';


@NgModule({
  declarations: [ConsumptionComponent],
  imports: [
    CommonModule,
    ConsumptionRoutingModule,
    FormsModule,NgZorroAntdModule,ReactiveFormsModule,
    CommonServiceModule
  ]
})
export class ConsumptionModule { }
