import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReimbursementComponent } from './reimbursement.component';

const routes: Routes = [
  {path:'', component:ReimbursementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReimbursementRoutingModule { }
