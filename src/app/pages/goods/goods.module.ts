import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodsRoutingModule } from './goods-routing.module';
import { GoodsComponent } from './goods.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonServiceModule } from '../../common-service/common-service.module';


@NgModule({
  declarations: [GoodsComponent],
  imports: [
    CommonModule,
    GoodsRoutingModule,
    NgZorroAntdModule,ReactiveFormsModule,FormsModule,
    CommonServiceModule
  ]
})
export class GoodsModule { }
