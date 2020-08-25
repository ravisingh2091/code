import { Component, OnInit } from '@angular/core';



import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  faqLists = [];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.commonService.showLoader = true
    let url = `${environment.api_url}faqList`
    this.apiService.getData(url).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.faqLists = result.data
      }

    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })

  }

}
