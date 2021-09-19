import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonServiceModule } from 'src/app/common-service/common-service.module';

@Component({
  selector: 'app-adminuser',
  templateUrl: './adminuser.component.html',
  styleUrls: ['./adminuser.component.css']
})
export class AdminuserComponent implements OnInit {
  isSpinning = false; // 全局loading开关
  validateForm!: FormGroup;
  UserModelForm!: FormGroup; // 添加/编辑用户FormGroup
  searchName = null;
  total = 1;
  pageSize = 10;
  loading = true; // 表格的loading
  pageIndex = 1;
  loginfo = window.localStorage.getItem('loginfo');
  token = JSON.parse((this.loginfo as string)).token;
  listOfRandomUser:any = []
  passwordVisible = false; // 编辑/添加管理员，密码是否可见开关
  ReimModelForm!: FormGroup; // 用户报账FormGroup
  reimComfirmIsVisible = false; // 报账确认弹出框显示变量
  isConfirmLoading = false;

  constructor(
    private notification: NzNotificationService,
    private http: HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private commonService: CommonServiceModule,
  ) { }

  ngOnInit(): void {
    this.loadDataFromServer({});
    this.resetValidateForm();
    this.resetUserModelForm();
    this.resetReimModelForm();
  }

  // 加载页面数据
  loadDataFromServer(query:object){
    const searchParam = {
      pageSize : this.pageSize,
      pageIndex : this.pageIndex,
      searchName: this.searchName,
      token: this.token,
      ...query
    };
    this.http.post(this.commonService.domain + 'install/adminuser/getList', searchParam).subscribe(data => {
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

  // 重置用户充值变量
  resetValidateForm(){
    this.validateForm = this.fb.group({
      userName: ['', []],
    });
  }
    
  // 搜索框方法
  submitSearchForm(){
    this.pageIndex = 1;
    this.loadDataFromServer({});
  }

  visible = false; // 添加编辑用户的可视开关
  addEditUserTitle = '创建管理员';
  addEditUserStatus = 0;
  open(open:string, id:number): void {
    this.visible = true;
    if(open == 'add'){
      // 添加进入
      this.addEditUserTitle = '创建管理员';
      this.addEditUserStatus = 0;
    }else{
      // 编辑进入
      this.addEditUserTitle = '编辑管理员';
      this.addEditUserStatus = id;
      this.isSpinning = true;
      this.http.post(this.commonService.domain + 'install/adminuser/getUser', {token:this.token, id:id}).subscribe(data => {
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

  // 重置添加/编辑用户变量
  resetUserModelForm(){
    this.UserModelForm = this.fb.group({
      user_login: ['', [Validators.required]],
      user_pass: ['', []],
      user_nickname: ['', [Validators.required]],
      user_status: ['1', [Validators.required]],
    });
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
    let uri = this.commonService.domain + 'install/adminuser/addUser'; 
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
        // setTimeout('location.reload()',1000);
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

  // 报账按钮
  reimUser = {userId:0,userName:''}; //报账用户的信息
  isVisible = false; 
  AdminUserList:any = []; // 收银人员数据，后台可登录的用户
  reimModal(userId:number,userName:string): void {
    this.reimUser.userId = userId;
    this.reimUser.userName = userName;
    this.isVisible = true;
    this.isSpinning = true;
    this.http.post(this.commonService.domain + 'install/user/getAdminUser', {token:this.token}).subscribe(data => {
      const dataObj = (data as any)
      this.AdminUserList = dataObj.data;
      this.isSpinning = false; 
    },err => {
      console.log(err)
      this.isSpinning = false; 
    });
  }

  // 重置用户报账变量
  resetReimModelForm(){
    this.ReimModelForm = this.fb.group({
      num: [0, [Validators.required]], // 报账数量
      adminId: ['', [Validators.required]], // 报账人id
      remark: ['', []],
    });
  }

  // 用户充值提交方法
  submitReimForm(){    
    this.isConfirmLoading = true;
    const submitRechargeParam = {
      token: this.token,
      ...this.ReimModelForm.value,
      ...this.reimUser
    };
    // console.log(submitRechargeParam);return;
    this.http.post(this.commonService.domain + 'install/adminuser/reimbursement', submitRechargeParam).subscribe(data => {
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
      this.reimComfirmIsVisible = false;
      this.resetReimModelForm();
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

  // 显示报账确认框
  showReimComfirmModal(): void {
    if(!this.ReimModelForm.valid){
      this.notification.create(
        'warning',
        '警告',
        '请填写完整数据'
      );
      return;
    }
    this.reimComfirmIsVisible = true;
  }

  // 报账取消框确认方法
  showReimComfirmHandleCancel(): void {
    this.reimComfirmIsVisible = false;
  }

  // 关闭充值modal
  handleCancel(): void {
    this.isVisible = false;
    this.resetReimModelForm();
  }

}
