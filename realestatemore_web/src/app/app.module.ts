import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { AsyncPipe } from '../../node_modules/@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// import { AngularFireModule } from "angularfire2";
// // // for AngularFireDatabase
// import { AngularFireDatabaseModule } from "angularfire2/database";
// // import { AngularFireDatabase } from "angularfire2/database";
// // // for AngularFireAuth
// import { AngularFireAuthModule } from "angularfire2/auth";
// // import { AngularFireAuth } from "angularfire2/auth";
//services 
import { ApiService } from "./services/api.service";
import { HeaderProvider } from "./services/header.provider";
import { MessagingService } from "./services/messaging.service";

//component 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './module/home/home.component';
import { HeaderComponent } from './module/header/header.component';
import { FooterComponent } from './module/footer/footer.component';
import { MapComponent } from './module/map/map.component';
import { NotFoundComponent } from './module/not-found/not-found.component';
import { NotificationComponent } from './module/notification/notification.component';
import { SubscriptionComponent } from './module/subscription/subscription.component';
import { PaymentComponent } from './module/payment/payment.component';
import { ChatComponent } from './module/chat/chat.component';
import { FavoritesComponent } from './module/favorites/favorites.component';
import { SideMenuModule } from "./module/side-menu/side-menu.module";
import { SearchModule } from "./shared/search/search.module";
import { ShareButtonModule } from '@ngx-share/button';


import { environment } from 'src/environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    MapComponent,
    NotFoundComponent,
    NotificationComponent,
    SubscriptionComponent,
    PaymentComponent,
    ChatComponent,
    FavoritesComponent,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SideMenuModule,
    CarouselModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMap,
      libraries: ['places']
    }),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }), // ToastrModule added
    SearchModule,
    ShareButtonModule,
    FormsModule,
    // AngularFireDatabaseModule,
    // AngularFireAuthModule,
    // AngularFireAuthModule,
    // AngularFireModule.initializeApp(environment.firebase),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ApiService,
    HeaderProvider,
    MessagingService,
    AsyncPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
