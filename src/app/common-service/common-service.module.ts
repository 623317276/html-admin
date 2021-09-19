import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CommonServiceModule {
  domain = "http://127.0.0.1:8080/public/index.php/";
  loginfo = window.localStorage.getItem('loginfo');
  token = ''; 

	constructor() {
		if(this.loginfo == ''){
			return ;
		}else{
			this.token = JSON.parse((this.loginfo as string)).token;
		}
	}
}
