import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { concatMap } from 'rxjs/operators';
import { CommonServiceModule } from 'src/app/common-service/common-service.module';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent implements OnInit {
  validateForm!: FormGroup;
  isSpinning = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private commonService: CommonServiceModule,
    ) {
      this.checkLogin();
    }

  submitForm(): void {
    this.isSpinning = true;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }    

    if (this.validateForm.valid) {
      this.http.post(this.commonService.domain + 'install/Userapi/login', this.validateForm.value).subscribe(data => {
        const dataObj = (data as any)
        if(dataObj.code == 1){
          this.message.create('success', dataObj.resule);
          const userInfo = {
            mobile: this.validateForm.value.mobile,            
            token: dataObj.token,
          };
          window.localStorage.setItem('loginfo', JSON.stringify(userInfo));
          // this.router.navigateByUrl('welcome');
          setTimeout('location.reload()',1000);
          
          
        }else{
          this.message.create('error', dataObj.resule);
        }
        this.isSpinning = false; 
      },err => {
        console.log(err)
        this.isSpinning = false; 
      });    
     }else{
      this.isSpinning = false; 
     }
  }

 
  
  // 检测是否已登录，登录的话就自动跳到welcome页面
  checkLogin(){
    const isLogin = window.localStorage.getItem('loginfo') ? true : false;
    if (isLogin) {
      this.router.navigateByUrl('welcome');
    }
  }  

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      mobile: ['admin_user', [Validators.required]],
      pwd: ['stdsFc56J*FDh6+', [Validators.required]],
    });
  }
}
