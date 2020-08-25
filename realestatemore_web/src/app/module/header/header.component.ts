import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { HeaderProvider } from "./../../services/header.provider";
import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  servicesLists: number
  userCount = 0
  notificationCount = 0
  constructor(
    public headerProvider: HeaderProvider,
    private apiService: ApiService,
    private commonService: CommonService,
    private translate: TranslateService
  ) {
    this.changeLang('ar')
  }

  changeLang(lan) {
    this.commonService.language = lan
    this.commonService.lang = lan
    this.translate.setDefaultLang(lan);
    this.translate.use(lan);
  }
  ngOnInit() {

    this.favorites()
    this.getUserList()
    this.notification()
  }

  favorites() {
    this.commonService.showLoader = true;
    let url = `${environment.api_url}mobile/listLikedPost`;
    let data: any = {}
    data.Type = "all",
      data.userId = localStorage.getItem("user_id")

    this.apiService.postData(url, data).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status == "true") {
        this.servicesLists = response.data.length
      }
    }, error => {
      this.commonService.showLoader = false;
      this.apiService.log(error)
    })
  }

  getUserList() {
    this.commonService.showLoader = true;
    let url = `${environment.api_url}mobile/chatUserList`
    return this.apiService.postData(url, { userId: localStorage.getItem("user_id") }).subscribe(result => {
      this.commonService.showLoader = false;
      if (result.status == "true") {
        this.userCount = result.data.length
      }
    }, error => {
      this.apiService.log(error)
      this.commonService.showLoader = false;
    })
  }
  notification() {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/notificationList/${localStorage.getItem('user_id')}`
    this.apiService.getData(url).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.notificationCount = result.data.length
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }
}
