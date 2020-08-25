import { Component, OnInit } from '@angular/core';


import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  servicesLists = []
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.servicesListing();
  }

  servicesListing() {
    this.commonService.showLoader = true;
    let url = `${environment.api_url}mobile/listLikedPost`;
    let data: any = {}
    data.Type = "all",
      data.userId = localStorage.getItem("user_id")

    this.apiService.postData(url, data).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status == "true") {
        this.servicesLists = response.data
      }
    }, error => {
      this.apiService.log(error)
    })
  }
  unLike(service, index) {
    this.commonService.showLoader = true;
    let url = `${environment.api_url}mobile/likedPost`
    let data: any = {}
    if (service.Type == "archInterior" || service.Type == "afterSales") {
      data.providerId = service._id
    } else {
      data.propertyId = service._id
    }
    data.Type = service.Type
    data.userId = localStorage.getItem("user_id")
    data.liked = false
    this.apiService.postData(url, data).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status == 'true') {
        this.servicesLists.splice(index, 1);
      }
    }, error => this.apiService.log(error))

  }
}
