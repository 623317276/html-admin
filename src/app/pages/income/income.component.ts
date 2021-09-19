import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceModule } from 'src/app/common-service/common-service.module';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {
  isSpinning = false; // 全局loading开关
  loginfo = window.localStorage.getItem('loginfo');
  token = JSON.parse((this.loginfo as string)).token;
  pageModel = {userNum:0,income:0};
  constructor(    
    private notification: NzNotificationService,
    private http: HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder,
    private commonService: CommonServiceModule,
  ) { }

  ngOnInit(): void {
    this.loadDataFromServer({});
  }


  // 加载页面数据
  loadDataFromServer(query:object){
    this.isSpinning = true;
    const searchParam = {
      token: this.token,
      ...query,
    };
    this.http.post(this.commonService.domain + 'install/income/getIncome', searchParam).subscribe(data => {
      const dataObj = (data as any)
      console.log(dataObj);
      if(dataObj.code == 1){
        this.pageModel = dataObj.data;
      }else{
        this.message.create('error', dataObj.resule);
      }
      this.isSpinning = false;
    },err => {
      console.log(err)
      this.isSpinning = false;
    });
  }

}
