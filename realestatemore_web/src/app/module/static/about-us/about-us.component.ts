import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  featuredLists: any;
  aboutData: any;



  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.featuredProperties();
    this.aboutDetail();
  }
  featuredProperties() {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/propertyListing`
    let data = {}
    data['Type'] = 'all'
    data['userId'] = localStorage.getItem("user_id")
    data['status'] = "active";
    data['view'] = "list";
    data['pageNo'] = '1'
    this.apiService.postData(url, data).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status = "true") {
        this.featuredLists = response.data
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }

  aboutDetail() {
    this.commonService.showLoader = true
    let url = `${environment.api_url}getAboutus`
    this.apiService.getData(url).subscribe(result => {
      if (result.status == "true") {
        this.aboutData = result.data
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }
}
