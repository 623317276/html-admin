import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  isSpinning = false; // 全局loading开关
  validateForm!: FormGroup;
  CarModelForm!: FormGroup; // 添加/编辑用户车辆FormGroup
  userList:any = [] // 用户信息
  total = 1;
  pageSize = 10;
  loading = true; // 表格的loading
  pageIndex = 1;
  loginfo = window.localStorage.getItem('loginfo');
  token = JSON.parse((this.loginfo as string)).token;
  listOfRandomUser:any = []
  carNumList = ['桂A','桂B','桂C','桂D','桂E','桂F','桂G','桂H','桂J'];

  constructor(
    private notification: NzNotificationService,
    private http: HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private nzMessageService: NzMessageService
  ) { }

  ngOnInit(): void {
    this.resetValidateForm();
    this.resetCarModelForm();
    this.loadDataFromServer({});
  }

  // 重置搜索变量
  resetValidateForm(){
    this.validateForm = this.fb.group({
      searchName: ['', []],
      carNumber1: ['', []],
      carNumber2: ['', []],
    });
  }

   // 重置添加/编辑用户车辆变量
   resetCarModelForm(){
    this.CarModelForm = this.fb.group({
      id: ['', []],
      car_number1: ['桂J', [Validators.required]],
      car_number2: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      remark: ['', []],
      uid: ['', [Validators.required]],
      insurance_expiration_time: ['', []],
    });
  }

  // 加载页面数据
  loadDataFromServer(query:object){
    const searchParam = {
      pageSize : this.pageSize,
      pageIndex : this.pageIndex,
      token: this.token,
      ...this.validateForm.value,
      ...query
    };
    this.http.post('http://th.whatphp.com/install/car/getList', searchParam).subscribe(data => {
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

  // 搜索框方法
  submitSearchForm(){
    this.pageIndex = 1;
    this.loadDataFromServer({});
  }

  visible = false; // 添加编辑用户的可视开关
  addEditCarTitle = '添加车辆';
  addEditUserStatus = 0;
  open(open:string, id:number): void {
    this.visible = true;
    // 获取all会员信息
    this.http.post('http://th.whatphp.com/install/user/getAllUser', {token:this.token}).subscribe(data => {
        const dataObj = (data as any)
        // console.log(dataObj);return;
        this.userList = dataObj.data;
      },err => {
        console.log(err)
    });
console.log(this.userList);
    if(open == 'add'){
      // 添加进入
      this.addEditCarTitle = '添加车辆';
      this.addEditUserStatus = 0;
    }else{
      // 编辑进入
      this.addEditCarTitle = '编辑车辆';
      this.addEditUserStatus = id;
      this.isSpinning = true;
      this.http.post('http://th.whatphp.com/install/car/getCar', {token:this.token, id:id}).subscribe(data => {
        this.isSpinning = false; 
        const dataObj = (data as any)
        this.CarModelForm.patchValue(dataObj.data); // 要用patchValue赋值才行
      },err => {
        console.log(err)
        this.isSpinning = false; 
      });
    }
    console.log(this.CarModelForm);
  }

  close(): void {
    this.visible = false;    
    this.isSpinning = false;
    this.resetCarModelForm();
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

  carModelSubmit(){    
    // 时间选择器，用DatePipe来做时间格式转换
    // console.log(this.CarModelForm.value.insurance_expiration_time | date:'yyyy:mm:ss');
    // console.log(this.CarModelForm.value);return;
    if(!this.CarModelForm.valid){
      this.notification.create(
        'warning',
        '警告',
        '请填写完整数据'
      );
    }
    this.isSpinning = true;
    const carModelParam = {
      token: this.token,
      id:this.addEditUserStatus,
      ...this.CarModelForm.value
    };
    let uri = 'http://th.whatphp.com/install/car/addCar'; 
    this.http.post(uri, carModelParam).subscribe(data => {
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
        this.resetCarModelForm();
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

  // 删除车辆
  deleteConfirm(id:number): void {
    this.isSpinning = true;
    this.http.post('http://th.whatphp.com/install/car/deleteCar', {token:this.token, id:id}).subscribe(data => {      
        const dataObj = (data as any)
        if(dataObj.code == 1){
          this.notification.create(
            'success',
            '成功',
            dataObj.resule
          );
          this.visible = false;
          this.loadDataFromServer({});
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
        console.log(err)
        this.isSpinning = false; 
      });   
  }
}
