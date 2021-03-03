import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { from } from 'rxjs';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

@NgModule({
  imports: [WelcomeRoutingModule,CommonModule,FormsModule,NgZorroAntdModule,ReactiveFormsModule],
  declarations: [WelcomeComponent ],
  exports: [WelcomeComponent]
})
export class WelcomeModule { 
  
}
