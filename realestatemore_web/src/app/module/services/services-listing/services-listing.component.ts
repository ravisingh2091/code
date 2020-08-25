import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-services-listing',
  templateUrl: './services-listing.component.html',
  styleUrls: ['./services-listing.component.css']
})
export class ServicesListingComponent implements OnInit {
  servicesLists = []
  totalCount: number
  disableNext: boolean = false
  disablePrevious: boolean = true
  listShowCount = 10
  pageNo = 1
  totalPageNo: number
  filterBy = 'archInterior'
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.featuredProperties();
  }
  selectFilter(filter) {
    this.filterBy = filter
    this.pageNo = 1
    this.featuredProperties()
  }
  featuredProperties() {

    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/propertyListing`

    let data = {}
    data['Type'] = this.filterBy
    data['userId'] = localStorage.getItem("user_id")
    data['status'] = "active";
    data['view'] = "list";
    data['pageNo'] = this.pageNo
    data['userId'] = localStorage.getItem('user_id')

    this.apiService.postData(url, data).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status = "true") {
        this.servicesLists = response.data
        this.totalCount = response.totalCount
        this.totalPageNo = Math.ceil(this.totalCount / this.listShowCount)
        this.disablePrevious = this.pageNo == 1 ? true : false
        this.disableNext = this.pageNo == this.totalPageNo ? true : false
      }

    })
  }
  selectedIndex(e) {
    this.pageNo = this.pageNo + e
    this.featuredProperties()
  }
  faviorite(property, event) {
    if (localStorage.getItem('user_id')) {
      this.commonService.showLoader = true
      let url = `${environment.api_url}mobile/likedPost`
      let data = {
        providerId: property._id,
        userId: localStorage.getItem('user_id'),
        liked: property.likedStatus == "yes" ? false : true,
        Type: property.Type
      }

      this.apiService.postData(url, data).subscribe(result => {
        this.commonService.showLoader = false
        if (result.status == 'true') {
          if (property.likedStatus == "yes") {
            event.classList.remove("active")
            property.likedStatus = "no"
          } else {
            property.likedStatus = "yes"
            event.classList.add("active")
          }
        }
      }, error => {
        this.commonService.showLoader = false
        this.apiService.log(error)
      })
    } else {
      this.router.navigate(['/user/sign-in'], { queryParams: { 'redirectURL': this.router.url } });
    }
  }
  searchSubmit(value) {
    let data = {
      userId: localStorage.getItem('user_id') || undefined,
      Type: this.filterBy,
      lat: value.lat,
      long: value.long,
      additionalId: value.add_id || undefined,
      available: value.available_for || undefined,
      modularKitchen: value.modular_kitchen || undefined,
      insurance: value.insurance || undefined,
      wifi: value.wifi || undefined,
      soundSystems: value.soundSystems || undefined,
      bedrooms: value.bedrooms || undefined,
      bathrooms: value.bedrooms || undefined,
      balcony: value.balcony || undefined,
      category: value.category || undefined,
      garden: value.garden || undefined,
      totalPriceMin: value.min_budget_size || undefined,
      totalPriceMax: value.max_budget_size || undefined,
      plotSizeMin: value.min_plot_size || undefined,
      plotSizeMax: value.max_plot_size || undefined,
      builtSizeMin: value.min_build_size || undefined,
      builtSizeMax: value.max_build_size || undefined,
      parking: value.parking || undefined,
      purpose: value.purpose || undefined,
      yearBuilt: value.year_of_build || undefined,
    }
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/searchProperty`
    this.apiService.postData(url, data).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status = "true") {
        this.servicesLists = response.data
        this.totalCount = response.totalCount
        this.totalPageNo = Math.ceil(this.totalCount / this.listShowCount)
        this.disablePrevious = this.pageNo == 1 ? true : false
        this.disableNext = this.pageNo == this.totalPageNo ? true : false
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }

}
