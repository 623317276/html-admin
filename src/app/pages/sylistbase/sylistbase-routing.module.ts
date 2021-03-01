import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SylistbaseComponent } from './sylistbase.component'
const routes: Routes = [
  {path:'', component:SylistbaseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SylistbaseRoutingModule { }
