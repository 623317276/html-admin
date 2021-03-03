import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeRoutingModule } from './income-routing.module';
import { IncomeComponent } from './income.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';


@NgModule({
  declarations: [IncomeComponent],
  imports: [
    CommonModule,
    IncomeRoutingModule,
    FormsModule,NgZorroAntdModule,ReactiveFormsModule
  ]
})
export class IncomeModule { }
