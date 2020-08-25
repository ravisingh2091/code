import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';


import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { CountryProvider } from "./../../services/countryCode.provider";
import { SideMenuModule } from "../side-menu/side-menu.module";
import { MyBookingComponent } from "./my-booking/my-booking.component";
import { CalendarModule } from "./../../shared/calendar/calendar.module";
import { CommonService } from 'src/app/services/common.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    SigninComponent,
    SignupComponent,
    MyBookingComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SideMenuModule,
    CalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    CountryProvider,
  ]
})
export class UserModule {
  constructor(
    private translate: TranslateService,
    private commonService: CommonService,
  ) {
    this.translate.use(this.commonService.language);
    this.commonService._lang.subscribe(result => {
      this.translate.use(result);
    })
  }
}
