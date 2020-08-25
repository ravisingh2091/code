import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notification = []
  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/notificationList/${localStorage.getItem('user_id')}`
    this.apiService.getData(url).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.notification = result.data
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }
  dataFormate(date) {
    return moment(date).fromNow()
  }
}
