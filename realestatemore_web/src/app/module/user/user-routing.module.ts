import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { LoginGuard } from "./../../gaurd/login.gaurd";
import { AuthGuard } from "./../../gaurd/auth.gaurd";
import { MyBookingComponent } from "./my-booking/my-booking.component";


const routes: Routes = [
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'my-booking', component: MyBookingComponent, canActivate: [AuthGuard] },
  { path: 'sign-in', component: SigninComponent, canLoad: [LoginGuard] },
  { path: 'sign-up', component: SignupComponent, canLoad: [LoginGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
