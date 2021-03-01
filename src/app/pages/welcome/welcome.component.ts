import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  isSpinning = false; // 全局loading开关
  validateForm!: FormGroup;
  RechargeModelForm!: FormGroup; // 用户充值FormGroup
  UserModel:any = []
  UserCarModel:any = []
  userList:any = []
  loginfo = window.localStorage.getItem('loginfo');
  token = JSON.parse((this.loginfo as string)).token;
  rechargeComfirmIsVisible = false; // 充值确认弹出框显示变量
  isConfirmLoading = false;

  isCollapse = true;

  constructor(
    private router: Router,
    private notification: NzNotificationService,
    private http: HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder,
    private modal: NzModalService
    ) {    
  }

  ngOnInit() {
    this.resetValidateForm();
    this.resetRechargeModelForm();
    this.loadDataFromServer({pageIndex:1,pageSize:9999});
  }


   // 重置搜索框变量
   resetValidateForm(){
    this.validateForm = this.fb.group({
      id: ['', [Validators.required]],
    });
  }
  
  // 搜索框方法
  submitSearchForm(){
    
  }

  // 加载页面数据
  loadDataFromServer(query:object){
    const searchParam = {
      token: this.token,
      ...this.validateForm.value,
      ...query
    };
    this.http.post('http://th.whatphp.com/install/user/getList', searchParam).subscribe(data => {
      const dataObj = (data as any)
      console.log(dataObj);
      if(dataObj.code == 1){
        this.userList = dataObj.data.list;
      }else{
        this.message.create('error', dataObj.resule);
      }
      this.userList.unshift({id:0,name:'非会员'});
      console.log(this.userList);
      this.isSpinning = false;
    },err => {
      console.log(err)
      this.isSpinning = false;
    });
  }

  // 选中会员改变方法
  userChange(id:number){
    if(id == 0){
      this.UserModel = {id:0,name:''};
      this.UserCarModel = [];
      return ;
    }
    this.isSpinning = true; 
    this.http.post('http://th.whatphp.com/install/user/getUser', {token:this.token, id:id}).subscribe(data => {
        this.isSpinning = false; 
        const dataObj = (data as any)
        this.UserModel = dataObj.data;
        console.log(this.UserModel);
      },err => {
        console.log(err)
        this.isSpinning = false; 
      });

      this.http.post('http://th.whatphp.com/install/car/getUserCar', {token:this.token, id:id}).subscribe(data => {
        this.isSpinning = false; 
        const dataObj = (data as any)
        this.UserCarModel = dataObj.data;
        console.log(this.UserCarModel);
      },err => {
        console.log(err)
        this.isSpinning = false; 
      });
  }

  // 充值按钮
  rechargeUser = {userId:0,userName:''}; //充值用户的信息
  isVisible = false; 
  AdminUserList:any = []; // 收银人员数据，后台可登录的用户
  rechargeModal(userId:number,userName:string): void {
    if(userId == 0 || !userId){
      this.message.create('error', '非会员不能充值');
      return;
    }
    this.rechargeUser.userId = userId;
    this.rechargeUser.userName = userName;
    this.isVisible = true;
    this.isSpinning = true;
    this.http.post('http://th.whatphp.com/install/user/getAdminUser', {token:this.token}).subscribe(data => {
      const dataObj = (data as any)
      this.AdminUserList = dataObj.data;
      this.isSpinning = false; 
    },err => {
      console.log(err)
      this.isSpinning = false; 
    });
  }

   // 重置用户充值变量
   resetRechargeModelForm(){
    this.RechargeModelForm = this.fb.group({
      num: [0, [Validators.required]],
      cashier: ['', [Validators.required]],
      cashierType: ['', [Validators.required]],
      remark: ['', []],
    });
  }

  // 关闭充值modal
  handleCancel(): void {
    this.isVisible = false;
    this.resetRechargeModelForm();
  }
  
  // 显示充值确认框
  showRechargeComfirmModal(): void {
    if(!this.RechargeModelForm.valid){
      this.notification.create(
        'warning',
        '警告',
        '请填写完整数据'
      );
      return;
    }
    this.rechargeComfirmIsVisible = true;
  }

  // 充值取消框确认方法
  showRechargeComfirmHandleCancel(): void {
    this.rechargeComfirmIsVisible = false;
  }

  // 用户充值提交方法
  submitRechargeForm(){    
    this.isConfirmLoading = true;
    const submitRechargeParam = {
      token: this.token,
      ...this.RechargeModelForm.value,
      ...this.rechargeUser
    };
    // console.log(submitRechargeParam);return;
    this.http.post('http://th.whatphp.com/install/user/recharge', submitRechargeParam).subscribe(data => {
      const dataObj = (data as any)
      if(dataObj.code == 0){
        this.notification.error(
          'error',
          dataObj.resule
        );
        this.isSpinning = false;
        this.isConfirmLoading = false;
        return;
      }else{
        this.isSpinning = false;
        this.notification.success(
          'success',
          dataObj.resule          
        );
      }
      this.isConfirmLoading = false;
      this.isVisible = false; 
      this.rechargeComfirmIsVisible = false;
      this.resetRechargeModelForm();
      this.userChange(this.rechargeUser.userId);
    },err => {
      console.log(err)
      this.isSpinning = false; 
      this.notification.error(
        'error',
        err.resule,
        
      );
      return;
    });
  }


}
