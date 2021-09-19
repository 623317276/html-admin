import { Component, OnInit } from '@angular/core';
import { CommonServiceModule } from 'src/app/common-service/common-service.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private commonService: CommonServiceModule,
		) { }

  ngOnInit(): void {
  }

}
