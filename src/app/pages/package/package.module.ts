import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageRoutingModule } from './package-routing.module';
import { PackageComponent } from './package.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PackageComponent],
  imports: [
    CommonModule,
    PackageRoutingModule,
    NgZorroAntdModule,ReactiveFormsModule,FormsModule
  ]
})
export class PackageModule { }
