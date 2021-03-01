import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  isSpinning = false; // 全局loading开关
  validateForm!: FormGroup;
  RechargeModelForm!: FormGroup; // 用户充值FormGroup
  ConsumptionModelForm!: FormGroup; // 用户消费FormGroup  
  UserModel = {id:1,name:'非会员',balance:0,arrears:0}
  GoodsModel:TransferItem[] = [] // 商品列表
  UserCarModel:any = []
  userList:any = []
  loginfo = window.localStorage.getItem('loginfo');
  token = JSON.parse((this.loginfo as string)).token;
  rechargeComfirmIsVisible = false; // 充值确认弹出框显示变量
  consumptionComfirmIsVisible = false; // 消费确认弹出框显示变量
  isConfirmLoading = false;
  isConsumptionConfirmLoading = false;

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
    this.resetConsumptionModelForm();
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
      console.log(this.userList);
      this.isSpinning = false;
    },err => {
      console.log(err)
      this.isSpinning = false;
    });
  }

  // 选中会员改变方法
  userChange(id:number){
    console.log(id);
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

  // 添加消费
  consumptionIsVisible = false;
  consumptionModal(userId:number,userName:string): void {
    this.isSpinning = true;
    this.getGoodsList();
    if(userId == 0){
      // 非会员进入
      
    }else{
      // 会员进入
      this.isSpinning = true;
      this.http.post('http://th.whatphp.com/install/user/getUser', {id:userId,token:this.token}).subscribe(data => {
        const dataObj = (data as any)
        this.UserModel = dataObj.data;
        this.isSpinning = false; 
      },err => {
        console.log(err)
        this.isSpinning = false; 
      });
    }
    this.consumptionIsVisible = true;
    
  }

  // 选择商品监听方法
  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  // 商品改变方法
  consumptionGoodsList:any = []; // 消费的商品变量
  change(ret: {}): void {
    this.resetConsumptionModelForm();
    this.consumptionGoodsList = [];
    let total = 0;
    for (const iterator of this.GoodsModel) {
      if(iterator.direction == 'right'){
        total += iterator.price;
        this.consumptionGoodsList.push(iterator);
      }
    }
    this.ConsumptionModelForm.patchValue({num:total});
    console.log(this.consumptionGoodsList);
    console.log(this.ConsumptionModelForm.value);
    console.log('nzChange', ret);
  }

  reload(direction: string): void {
    this.getGoodsList();
    this.message.success(`拉取成功`);
  }

  // 获取商品方法
  getGoodsList(){
    this.isSpinning = true; 
    const searchParam = {
      pageSize : 9999,
      pageIndex : 1,
      token: this.token,
    };
    // 获取所有商品数据
    this.http.post('http://th.whatphp.com/install/goods/getList', searchParam).subscribe(data => {
        const dataObj = (data as any)
        this.GoodsModel = dataObj.data.list;
        this.isSpinning = false; 
      },err => {
        console.log(err)
        this.isSpinning = false; 
      });
  }
  // 关闭消费modal
  consumptionHandleCancel(): void {
    this.consumptionIsVisible = false;
    this.resetConsumptionModelForm();
  }

  // 显示消费确认框
  showConsumptionComfirmModal(): void {
    console.log(this.ConsumptionModelForm.value);
    if(!this.ConsumptionModelForm.valid){
      this.notification.create(
        'warning',
        '警告',
        '请填写完整数据'
      );
      return;
    }
    this.consumptionComfirmIsVisible = true;
  }

  // 用户消费提交方法
  submitConsumptionForm(){    
    this.isSpinning = true;
    const submitConsumptionParam = {
      token: this.token,
      ...this.ConsumptionModelForm.value,
      ...this.UserModel,
      goodsList:this.consumptionGoodsList
    };
    // console.log(submitConsumptionParam);return;
    this.http.post('http://th.whatphp.com/install/user/consumption', submitConsumptionParam).subscribe(data => {
      const dataObj = (data as any)
      if(dataObj.code == 0){
        this.notification.error(
          'error',
          dataObj.resule
        );
        this.isSpinning = false;
        return;
      }else{
        this.isSpinning = false;
        this.notification.success(
          'success',
          dataObj.resule          
        );
      }
      this.consumptionIsVisible = false; 
      this.consumptionComfirmIsVisible = false;
      this.resetConsumptionModelForm();
      this.userChange(this.UserModel.id);
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

  // 充值取消框确认方法
  showConsumptionComfirmHandleCancel(): void {
    this.consumptionComfirmIsVisible = false;
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

  // 重置用户消费变量
  resetConsumptionModelForm(){
    this.ConsumptionModelForm = this.fb.group({
      num: [0, [Validators.required]], // 消费总金额
      cashierType: ['1', [Validators.required]], // 付款方式
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
