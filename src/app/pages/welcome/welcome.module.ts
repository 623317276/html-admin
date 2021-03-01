import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { from } from 'rxjs';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [WelcomeRoutingModule,FormsModule,NgZorroAntdModule,ReactiveFormsModule,CommonModule],
  declarations: [WelcomeComponent ],
  exports: [WelcomeComponent]
})
export class WelcomeModule { 
  
}
