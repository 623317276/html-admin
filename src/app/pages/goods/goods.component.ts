import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css']
})
export class GoodsComponent implements OnInit {
  isSpinning = false; // 全局loading开关
  validateForm!: FormGroup;
  GoodsModelForm!: FormGroup; // 添加/编辑商品FormGroup
  searchName = null;
  total = 1;
  pageSize = 10;
  loading = true; // 表格的loading
  pageIndex = 1;
  loginfo = window.localStorage.getItem('loginfo');
  token = JSON.parse((this.loginfo as string)).token;
  listOfRandomUser:any = []
  passwordVisible = false; // 编辑/添加管理员，密码是否可见开关

  constructor(
    private notification: NzNotificationService,
    private http: HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder,
    private modal: NzModalService
    ) { }

  ngOnInit(): void {
    this.loadDataFromServer({});
    this.resetValidateForm();
    this.resetUserModelForm();
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
    this.http.post('http://th.whatphp.com/install/goods/getList', searchParam).subscribe(data => {
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

  visible = false; // 添加编辑用户的可视开关
  addEditUserTitle = '添加商品';
  addEditUserStatus = 0;
  open(open:string, id:number): void {
    this.visible = true;
    if(open == 'add'){
      // 添加进入
      this.addEditUserTitle = '添加商品';
      this.addEditUserStatus = 0;
    }else{
      // 编辑进入
      this.addEditUserTitle = '编辑商品';
      this.addEditUserStatus = id;
      this.isSpinning = true;
      this.http.post('http://th.whatphp.com/install/goods/getGoods', {token:this.token, id:id}).subscribe(data => {
        this.isSpinning = false; 
        const dataObj = (data as any)
        this.GoodsModelForm.patchValue(dataObj.data); // 要用patchValue赋值才行
      },err => {
        console.log(err)
        this.isSpinning = false; 
      });
    }
    console.log(this.GoodsModelForm);
  }

  close(): void {
    this.visible = false;    
    this.isSpinning = false;
    this.resetUserModelForm();
  }

  // 重置添加/编辑用户变量
  resetUserModelForm(){
    this.GoodsModelForm = this.fb.group({
      // number: ['', [Validators.required],
      name: ['', [Validators.required]],
      remark: ['', []],
      price: ['', [Validators.required]],
      status: ['1', [Validators.required]],
      stock: ['0', [Validators.required]],
    });
  }

  // 重置用户充值变量
  resetValidateForm(){
    this.validateForm = this.fb.group({
      goodsName: ['', []],
    });
  }

  // 搜索框方法
  submitSearchForm(){
    this.pageIndex = 1;
    this.loadDataFromServer({});
  }

  goodsModelSubmit(){    
    // console.log(this.GoodsModelForm.value);return;
    if(!this.GoodsModelForm.valid){
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
      ...this.GoodsModelForm.value
    };
    let uri = 'http://th.whatphp.com/install/goods/addGoods'; 
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




}
