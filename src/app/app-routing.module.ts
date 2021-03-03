import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/auth-guard.module';
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path:'login',
    // canLoad: [AuthGuard],
    // canActivateChild: [AuthGuard],
    // canDeactivate: [AuthGuard],
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
  },
  { path: 'welcome', canActivate: [AuthGuard], loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'user', canActivate: [AuthGuard], loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule) },
  { path: 'sylistbase', canActivate: [AuthGuard], loadChildren: () => import('./pages/sylistbase/sylistbase.module').then(m => m.SylistbaseModule) },
  { path: 'adminuser', canActivate: [AuthGuard], loadChildren: () => import('./pages/adminuser/adminuser.module').then(m => m.AdminuserModule) },
  { path: 'car', canActivate: [AuthGuard], loadChildren: () => import('./pages/car/car.module').then(m => m.CarModule) },
  { path: 'goods', canActivate: [AuthGuard], loadChildren: () => import('./pages/goods/goods.module').then(m => m.GoodsModule) },
  { path: 'package', canActivate: [AuthGuard], loadChildren: () => import('./pages/package/package.module').then(m => m.PackageModule) },
  { path: 'consumption', canActivate: [AuthGuard], loadChildren: () => import('./pages/consumption/consumption.module').then(m => m.ConsumptionModule) },
  { path: 'income', canActivate: [AuthGuard], loadChildren: () => import('./pages/income/income.module').then(m => m.IncomeModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
