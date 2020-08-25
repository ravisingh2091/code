import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('gm', { static: true }) gm: ElementRef
  @ViewChild('infoWindow', { static: true }) infoWindow: ElementRef
  lat = 28.5355
  lng = 77.3910
  servicesLists = []
  infoWindowOpened = null
  previous_info_window = null
  filterBy: any;
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.servicesListing('all');
    navigator.geolocation.getCurrentPosition(resp => {
      this.lng = resp.coords.longitude
      this.lat = resp.coords.latitude
    })
  }
  mapClickCheck(dsf) {
    if (this.previous_info_window != null) {
      this.previous_info_window.close()

    }
  }


  servicesListing(filterBy) {
    this.filterBy = filterBy
    this.servicesLists = []
    this.commonService.showLoader = true;
    let url = `${environment.api_url}mobile/propertyListing`;
    let data: any = {}
    data.Type = filterBy
    data.userId = localStorage.getItem("user_id")
    data.view = 'map'
    this.apiService.postData(url, data).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status == "true") {

        for (let list of response.data) {
          let icon
          let totalPrice
          let labelWidth
          if (list.Type == 'buy' || list.Type == 'rentevent') {
            icon = 'https://res.cloudinary.com/dbxy0zgpj/image/upload/v1572426753/blue_bov_icn_r3sqfd.png'
            totalPrice = "SAR " + list.totalPrice
            labelWidth = totalPrice.length > 10 ? totalPrice.length * 11 : totalPrice.length * 15
          } else if (list.Type == 'rent') {
            icon = 'https://res.cloudinary.com/dbxy0zgpj/image/upload/v1572426753/blue_bov_icn_r3sqfd.png'
            totalPrice = `SAR ${list.totalPrice}/${list.rentTime}`
            labelWidth = totalPrice.length > 10 ? totalPrice.length * 11 : totalPrice.length * 15
          }

          let dataObj = {
            _id: list._id,
            latitude: list.location.coordinates[1],
            longitude: list.location.coordinates[0],
            likedStatus: list.likedStatus,
            imagesFile: list.imagesFile,
            category: list.category,
            address: list.address,
            userId: list.userId,
            Type: list.Type,
            title: list.title,
            icon: {
              url: list.specialOffer ? "https://realestateandmore4-dev.s3.us-east-2.amazonaws.com/user/blue%402x.png" : icon,
              scaledSize: {
                height: 40,
                width: labelWidth
              }
            },
            label: {
              // fontWeight: 'bold',
              text: totalPrice
            },
          }
          this.servicesLists = [...this.servicesLists, dataObj]
        }

      }
    }, error => {
      this.apiService.log(error)
    })
  }

  faviorite(service, event) {
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
    data.liked = service.likedStatus == "yes" ? false : true
    this.apiService.postData(url, data).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status == 'true') {
        if (service.likedStatus == "yes") {
          event.classList.remove("active")
          service.likedStatus = 'no'
        } else {
          service.likedStatus = 'yes'
          event.classList.add("active")
        }
      }
    }, error => this.apiService.log(error))

  }
  closeLastWindow(gm, infoWindow) {
    if (this.previous_info_window == null)
      this.previous_info_window = infoWindow;
    else {
      this.infoWindowOpened = infoWindow
      this.previous_info_window.close()
    }
    this.previous_info_window = infoWindow
  }

  sendMessage(receiver_id, propertyId, propertyType) {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/requestMessage`
    let data = {
      sender_id: localStorage.getItem("user_id"),
      receiver_id,
      propertyId,
      propertyType
    }
    this.apiService.postData(url, data).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.router.navigate(['/chat'])
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }
  searchSubmit(value) {
    this.servicesLists = []
    // duplex: ""
    // lift: ""
    // modular_kitchen: ""
    // store: ""
    let data = {
      userId: localStorage.getItem('user_id') || undefined,
      Type: this.filterBy,
      lat: value.lat,
      long: value.long,
      additionalId: value.add_id || undefined,
      available: value.available_for || undefined,
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
    this.apiService.postData(url, data).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        for (let list of result.data) {
          let icon
          let totalPrice
          let labelWidth
          if (list.Type == 'buy' || list.Type == 'rentevent') {
            icon = 'https://res.cloudinary.com/dbxy0zgpj/image/upload/v1572426753/blue_bov_icn_r3sqfd.png'
            totalPrice = "SAR " + list.totalPrice
            labelWidth = totalPrice.length > 10 ? totalPrice.length * 11 : totalPrice.length * 15
          } else if (list.Type == 'rent') {
            icon = 'https://res.cloudinary.com/dbxy0zgpj/image/upload/v1572426753/blue_bov_icn_r3sqfd.png'
            totalPrice = `SAR ${list.totalPrice}/${list.rentTime}`
            labelWidth = totalPrice.length > 10 ? totalPrice.length * 11 : totalPrice.length * 15
          }

          let dataObj = {
            _id: list._id,
            latitude: list.location.coordinates[1],
            longitude: list.location.coordinates[0],
            likedStatus: list.likedStatus,
            imagesFile: list.imagesFile,
            category: list.category,
            address: list.address,
            userId: list.userId,
            Type: list.Type,
            title: list.title,
            icon: {
              url: list.specialOffer ? "https://realestateandmore4-dev.s3.us-east-2.amazonaws.com/user/blue%402x.png" : icon,
              scaledSize: {
                height: 40,
                width: labelWidth
              }
            },
            label: {
              // fontWeight: 'bold',
              text: totalPrice
            },
          }
          this.servicesLists = [...this.servicesLists, dataObj]
        }
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }
}


