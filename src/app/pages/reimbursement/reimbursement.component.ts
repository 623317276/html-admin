import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reimbursement',
  templateUrl: './reimbursement.component.html',
  styleUrls: ['./reimbursement.component.css']
})
export class ReimbursementComponent implements OnInit {
  validateForm!: FormGroup;
  sylistbaseList:any = []
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  loading = true; // 表格的loading
  searchName = null;
  loginfo = window.localStorage.getItem('loginfo');
  token = JSON.parse((this.loginfo as string)).token;
  isSpinning = false; // 全局loading开关

  constructor(
    private notification: NzNotificationService,
    private http: HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder,
  ) { }

  // 搜索框方法
  submitSearchForm(){
    this.pageIndex = 1;
    this.loadDataFromServer({});
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

  // 加载页面数据
  loadDataFromServer(query:object){
    this.isSpinning = true;
    const searchParam = {
      pageSize : this.pageSize,
      pageIndex : this.pageIndex,
      token: this.token,
      ...query,
      ...this.validateForm.value
    };
    this.http.post('http://th.whatphp.com/install/reimbursement/getList', searchParam).subscribe(data => {
      const dataObj = (data as any)
      console.log(dataObj);
      if(dataObj.code == 1){
        this.sylistbaseList = dataObj.data.list;
        this.total = dataObj.data.total;
      }else{
        this.message.create('error', dataObj.resule);
      }
      this.loading = false;
      this.isSpinning = false;
    },err => {
      console.log(err)
      this.loading = false;
      this.isSpinning = false;
    });
  }

  // 导出表格
  export(){
    this.notification
      .blank(
        'Title',
        '此功能后续开发.'
      )
      .onClick.subscribe(() => {
        console.log('notification clicked!');
      });
  }
  // 搜索框变量重置
  resetValidateForm(){
    this.validateForm = this.fb.group({
      userName: ['', []],
    });
  }

  ngOnInit(): void {
    this.resetValidateForm();
    this.loadDataFromServer({});
  }

}
