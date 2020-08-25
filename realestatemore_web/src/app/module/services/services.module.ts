import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgmCoreModule } from '@agm/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesListingComponent } from './services-listing/services-listing.component';
import { PostServicesComponent } from './post-services/post-services.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { PaginationModule } from "./../../shared/pagination/pagination.module";
import { SearchModule } from "./../../shared/search/search.module";
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/services/common.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    ServicesListingComponent,
    PostServicesComponent,
    ServiceDetailsComponent,
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationModule,
    SearchModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMap
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class ServicesModule {
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
