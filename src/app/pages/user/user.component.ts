import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  validateForm!: FormGroup;
  UserModelForm!: FormGroup; // 添加/编辑用户FormGroup
  RechargeModelForm!: FormGroup; // 用户充值FormGroup
  listOfRandomUser:any = []
  searchName = null;
  total = 1;
  pageSize = 10;
  loading = true; // 表格的loading
  pageIndex = 1;
  loginfo = window.localStorage.getItem('loginfo');
  token = JSON.parse((this.loginfo as string)).token;

  // 加载页面数据
  loadDataFromServer(query:object){
    const searchParam = {
      pageSize : this.pageSize,
      pageIndex : this.pageIndex,
      searchName: this.searchName,
      token: this.token,
      ...query
    };
    this.http.post('http://th.whatphp.com/install/user/getList', searchParam).subscribe(data => {
      const dataObj = (data as any)
      console.log(dataObj);
      if(dataObj.code == 1){
        this.listOfRandomUser = dataObj.data.list;
        this.total = dataObj.data.total;
      }else{
        this.message.create('error', dataObj.resule);
      }
      this.loading = false;
    },err => {
      console.log(err)
      this.loading = false;
    });
  }


  // 每页显示数量改变时的回调函数	
  nzPageSizeChange(pageSize:number){
    this.notification
      .blank(
        'Title',
        '暂不支持此功能.'
      )
      .onClick.subscribe(() => {
        console.log('notification clicked!');
      });
    // this.pageSize = pageSize;
    // this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }

  nzPageIndexChange(pageIndex:number){
    this.pageIndex = pageIndex;
    this.loadDataFromServer({});
  }

  // 搜索框方法
  submitSearchForm(){
    this.pageIndex = 1;
    this.loadDataFromServer({});
  }

  visible = false; // 添加编辑用户的可视开关
  isSpinning = false; // 全局loading开关
  addEditUserTitle = '创建会员';
  addEditUserStatus = 0;
  open(open:string, id:number): void {
    this.visible = true;
    if(open == 'add'){
      // 添加进入
      this.addEditUserTitle = '创建会员';
      this.addEditUserStatus = 0;
    }else{
      // 编辑进入
      this.addEditUserTitle = '编辑会员';
      this.addEditUserStatus = id;
      this.isSpinning = true;
      this.http.post('http://th.whatphp.com/install/user/getUser', {token:this.token, id:id}).subscribe(data => {
        this.isSpinning = false; 
        const dataObj = (data as any)
        this.UserModelForm.patchValue(dataObj.data); // 要用patchValue赋值才行
      },err => {
        console.log(err)
        this.isSpinning = false; 
      });
    }
    console.log(this.UserModelForm);
  }

  
  close(): void {
    this.visible = false;    
    this.isSpinning = false;
    this.resetUserModelForm();
  }

  userModelSubmit(){    
    // console.log(this.UserModelForm.value);return;
    if(!this.UserModelForm.valid){
      this.notification.create(
        'warning',
        '警告',
        '请填写完整数据'
      );
    }
    this.isSpinning = true;
    const userModelParam = {
      token: this.token,
      id:this.addEditUserStatus,
      ...this.UserModelForm.value
    };
    let uri = 'http://th.whatphp.com/install/user/addUser'; 
    this.http.post(uri, userModelParam).subscribe(data => {
      const dataObj = (data as any)
      console.log(dataObj);
      if(dataObj.code == 1){
        this.notification.create(
          'success',
          '成功',
          dataObj.resule
        );
        this.visible = false;
        this.loadDataFromServer({});
        this.resetUserModelForm();
      }else{
        this.notification.create(
          'error',
          '错误',
          dataObj.resule
        );
      }
      this.isSpinning = false;
    },err => {
      this.notification.create(
        'error',
        '错误',
        err.message
      );
      console.log(err);
      this.isSpinning = false;
    });

  }
  // 显示充值modal
  isVisible = false; // 充值弹出框显示变量
  rechargeComfirmIsVisible = false; // 充值确认弹出框显示变量
  isConfirmLoading = false;
  AdminUserList:any = {}; // 收银人员数据，后台可登录的用户
  rechargeUser = {userId:0,userName:''}; //充值用户的信息
  rechargeModal(userId:number,userName:string): void {
    this.rechargeUser.userId = userId;
    this.rechargeUser.userName = userName;
    this.isVisible = true;
    this.isSpinning = true;
    this.http.post('http://th.whatphp.com/install/user/getAdminUser', {token:this.token}).subscribe(data => {
      this.isSpinning = false; 
      const dataObj = (data as any)
      this.AdminUserList = dataObj.data;
    },err => {
      console.log(err)
      this.isSpinning = false; 
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
      this.loadDataFromServer({});
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

  constructor(
    private notification: NzNotificationService,
    private http: HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder,
    private modal: NzModalService
    ) {}
  
  // 重置添加/编辑用户变量
  resetUserModelForm(){
    this.UserModelForm = this.fb.group({
      name: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      user_remark: ['', []],
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
  ngOnInit(): void {
    this.loadDataFromServer({});
    this.validateForm = this.fb.group({
      userName: [null, []],
      password: [null, [Validators.required]],
      remember: [true]
    });
    this.resetUserModelForm();
    this.resetRechargeModelForm();
  }

}
