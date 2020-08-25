import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesListingComponent } from './services-listing/services-listing.component';
import { PostServicesComponent } from './post-services/post-services.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';


const routes: Routes = [
  { path: 'services-listing', component: ServicesListingComponent },
  { path: 'post-services', component: PostServicesComponent },
  { path: 'services-details/:service_id', component: ServiceDetailsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
