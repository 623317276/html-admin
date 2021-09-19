import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarRoutingModule } from './car-routing.module';
import { CarComponent } from './car.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonServiceModule } from '../../common-service/common-service.module';


@NgModule({
  declarations: [CarComponent],
  imports: [
    CommonModule,
    CarRoutingModule,
    NgZorroAntdModule,ReactiveFormsModule,FormsModule,
    CommonServiceModule
  ]
})
export class CarModule { }
