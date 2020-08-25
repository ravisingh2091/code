import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageVanueBookingComponent } from './manage-vanue-booking/manage-vanue-booking.component';
import { ManagePropertiesComponent } from './manage-properties/manage-properties.component';
import { PostPropertiesComponent } from './post-properties/post-properties.component';
import { PropertiesListingComponent } from './properties-listing/properties-listing.component';
import { PropertiesDetailsComponent } from './properties-details/properties-details.component';
import { OwnerPropertyComponent } from './owner-property/owner-property.component';
import { EditPropertiesComponent } from './edit-properties/edit-properties.component';
import { BookEventComponent } from './book-event/book-event.component';


const routes: Routes = [
  { path: 'manage-vanue-booking', component: ManageVanueBookingComponent },
  { path: 'manage-properties', component: ManagePropertiesComponent },
  { path: 'post-properties', component: PostPropertiesComponent },
  { path: 'properties-listing', component: PropertiesListingComponent },
  { path: 'properties-details/:property_id', component: PropertiesDetailsComponent },
  { path: 'owner-property/:owner_id', component: OwnerPropertyComponent },
  { path: 'edit-property/:type/:property_id', component: EditPropertiesComponent },
  { path: 'book-event/:property_id', component: BookEventComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertiesRoutingModule { }
