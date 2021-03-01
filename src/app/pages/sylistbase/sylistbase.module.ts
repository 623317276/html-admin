import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SylistbaseRoutingModule } from './sylistbase-routing.module';
import { SylistbaseComponent } from './sylistbase.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [SylistbaseComponent],
  imports: [
    CommonModule,
    SylistbaseRoutingModule,NgZorroAntdModule,ReactiveFormsModule,FormsModule
  ]
})
export class SylistbaseModule { }
