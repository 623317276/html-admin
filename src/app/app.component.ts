import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  isActive = false;
  UserInfo = {
    mobile:'',
    pwd:''
  }; // 用户数据变量
  constructor(
    private router: Router,
    private nzMessageService: NzMessageService
    ) {
    this.checkLogin();
  }


  // 检测是否已登录，登录的话就自动跳到welcome页面
  checkLogin(){
    const isLogin = window.localStorage.getItem('loginfo') ? true : false;
    const str = window.localStorage.getItem('loginfo');
    if (isLogin) {
      this.isActive =  true;
      this.UserInfo = JSON.parse((str as string));
    }else{
      this.isActive =  false;
    }
  }
  
  cancel(): void {
    // this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.exit()
    // this.nzMessageService.info('click confirm');
  }

  exit(){
    window.localStorage.setItem('loginfo', '');
    // this.router.navigateByUrl('login');
    location.reload()
  }
}
