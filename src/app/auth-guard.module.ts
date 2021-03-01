import { Injectable} from '@angular/core';
import {
 CanActivate,
 Router,
 ActivatedRouteSnapshot,
 RouterStateSnapshot,
 CanActivateChild,
 CanLoad,
 CanDeactivate
} from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { LoginComponent } from './pages/login/login.component';


@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate, CanActivateChild, CanLoad, CanDeactivate<any> {
 constructor(
  private router: Router,
 ) {
 
 }

// 进入事件
 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  // 权限控制逻辑如 是否登录/拥有访问权限
    const isLogin = window.localStorage.getItem('loginfo') ? true : false;
    // console.log(route)
    if (!isLogin) {
        if(route.routeConfig?.path != 'login'){
            this.router.navigateByUrl('login');
        }
    }else{
        // this.router.navigateByUrl('welcome');
    }
    return true;
    
 }

// 离开事件
 canDeactivate(
  component: LoginComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot) {
  console.log('canDeactivate');
  return true;
 }

 canActivateChild() {
  // 返回false则导航将失败/取消
  // 也可以写入具体的业务逻辑
  console.log('canActivateChild');
  return true;
 }

 canLoad(route: Route) {
  // 是否可以加载路由
    console.log(route);
  console.log('canload');
  return true;
 }
}