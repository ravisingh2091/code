import { Component, OnInit } from '@angular/core';

import { environment } from "src/environments/environment";
import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-manage-properties',
  templateUrl: './manage-properties.component.html',
  styleUrls: ['./manage-properties.component.css']
})
export class ManagePropertiesComponent implements OnInit {
  propertyLists = []
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.postedPropertyList("1", "active")
  }

  toggleStatus(status) {
    this.postedPropertyList("1", status)
  }
  postedPropertyList(pageNo, status) {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/myPropertylisting`
    let data = {
      userId: localStorage.getItem("user_id"),
      status,
      pageNo
    }
    this.apiService.postData(url, data).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.propertyLists = result.data
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }
  deleteProperty(property, i) {
    // this.servicesLists.splice(index, 1);
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/deleteProperty`
    this.apiService.postData(url, { propertyId: property._id }).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.propertyLists.splice(i, 1)
        this.commonService.succ(result.message)
      }
    }, error => {
      this.commonService.showLoader = false
      this.commonService.err("Something went wrong")
      this.apiService.log(error)
    })
  }
  markAsBooked(id) {
    this.commonService.showLoader = true
    let url = `${environment.api_url}web/markAsBooked`
    let data = {
      userId: localStorage.getItem("user_id"),
      propertyId: id
    }
    this.apiService.postData(url, data).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.commonService.succ(result.message)
      }
    }, error => {
      this.commonService.showLoader = false
      this.commonService.err("Something went wrong")
      this.apiService.log(error)
    })
  }
}

