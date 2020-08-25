import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AgmCoreModule } from '@agm/core';
import { ShareButtonModule } from '@ngx-share/button';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { PropertiesRoutingModule } from './properties-routing.module';
import { ManageVanueBookingComponent } from './manage-vanue-booking/manage-vanue-booking.component';
import { ManagePropertiesComponent } from './manage-properties/manage-properties.component';
import { PostPropertiesComponent } from './post-properties/post-properties.component';
import { BuyComponent } from './post-properties/buy/buy.component';
import { RentComponent } from './post-properties/rent/rent.component';
import { PropertiesListingComponent } from './properties-listing/properties-listing.component';
import { PropertiesDetailsComponent } from './properties-details/properties-details.component';
import { OwnerPropertyComponent } from './owner-property/owner-property.component';
import { EditPropertiesComponent } from './edit-properties/edit-properties.component';
import { BookEventComponent } from './book-event/book-event.component';
import { BuyEditComponent } from './edit-properties/buy/buy-edit.component';
import { RentEditComponent } from './edit-properties/rent/rent-edit.component';
import { SideMenuModule } from "../side-menu/side-menu.module";
import { PaginationModule } from "./../../shared/pagination/pagination.module";
import { CalendarModule } from "./../../shared/calendar/calendar.module";
import { SearchModule } from "./../../shared/search/search.module";
import { PostEventCalendarComponent } from "./post-properties/post-event-calendar/post-event-calendar.component";

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/services/common.service';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    ManageVanueBookingComponent,
    ManagePropertiesComponent,
    PostPropertiesComponent,
    PropertiesListingComponent,
    PropertiesDetailsComponent,
    OwnerPropertyComponent,
    EditPropertiesComponent,
    BuyEditComponent,
    BuyComponent,
    RentComponent,
    RentEditComponent,
    BookEventComponent,
    PostEventCalendarComponent
  ],
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    SideMenuModule,
    PaginationModule,
    CalendarModule,
    SearchModule,
    ReactiveFormsModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMap
    }),
    ShareButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class PropertiesModule {

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
