import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-owner-property',
  templateUrl: './owner-property.component.html',
  styleUrls: ['./owner-property.component.css']
})
export class OwnerPropertyComponent implements OnInit {
  ownerId: string;
  ownerProperty = [];
  ownerData: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    this.ownerId = this.route.snapshot.paramMap.get("owner_id")
  }

  ngOnInit() {

    let url = `${environment.api_url}mobile/myPropertylisting`
    let data = {
      userId: this.ownerId,
      status: 'active',
      pageNo: '1'
    }
    this.commonService.showLoader = true
    this.apiService.postData(url, data).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status = 'true') {
        this.ownerProperty = result.data
        this.ownerData = result.userData
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error);
    })
  }


}
