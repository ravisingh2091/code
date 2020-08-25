import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { HomeComponent } from './module/home/home.component';
import { MapComponent } from './module/map/map.component';
import { ChatComponent } from './module/chat/chat.component';
import { FavoritesComponent } from './module/favorites/favorites.component';
import { NotificationComponent } from './module/notification/notification.component';
import { PaymentComponent } from './module/payment/payment.component';
import { SubscriptionComponent } from './module/subscription/subscription.component';
import { NotFoundComponent } from './module/not-found/not-found.component';
import { AuthGuard } from "./gaurd/auth.gaurd";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notification',
    component: NotificationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./module/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'properties',
    loadChildren: () => import('./module/properties/properties.module').then(m => m.PropertiesModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./module/services/services.module').then(m => m.ServicesModule)
  },
  {
    path: 'static',
    loadChildren: () => import('./module/static/static.module').then(m => m.StaticModule)
  },
  { path: '**', component: NotFoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // scrollPositionRestoration:'enabled',
    // anchorScrolling:"enabled",
  })
  ],
  exports: [RouterModule],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class AppRoutingModule { }
