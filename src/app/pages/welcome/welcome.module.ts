import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { from } from 'rxjs';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonServiceModule } from '../../common-service/common-service.module';

@NgModule({
  imports: [WelcomeRoutingModule,CommonModule,FormsModule,NgZorroAntdModule,ReactiveFormsModule,CommonServiceModule],
  declarations: [WelcomeComponent ],
  exports: [WelcomeComponent]
})
export class WelcomeModule { 
  
}
