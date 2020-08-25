import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-properties-details',
  templateUrl: './properties-details.component.html',
  styleUrls: ['./properties-details.component.css']
})
export class PropertiesDetailsComponent implements OnInit {
  propertyId: string
  userId: string = localStorage.getItem('user_id')
  propertyDetail: any = {}
  reportForm: FormGroup
  formSubmited: boolean = false
  @ViewChild('closeModel', { static: true }) closeModel: ElementRef
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.propertyId = this.route.snapshot.paramMap.get('property_id')
    this.reportForm = this.fb.group({
      'details': ['', Validators.required],
      "reason": ['', Validators.required]
    })
  }

  ngOnInit() {
    this.getPropDetail();
  }
  getPropDetail() {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/getPropertyDetails`
    let data = {
      propertyId: this.propertyId,
      userId: this.userId
    }
    this.apiService.postData(url, data).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.propertyDetail = result.data
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)

    })
  }
  faviorite(property, event) {
    if (localStorage.getItem('user_id')) {
      this.commonService.showLoader = true
      let url = `${environment.api_url}mobile/likedPost`
      let data = {
        propertyId: property._id,
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
  reportSubmit() {
    if (localStorage.getItem('user_id')) {
      this.formSubmited = true
      if (this.reportForm.invalid) {
        return
      }
      this.commonService.showLoader = true
      let url = `${environment.api_url}mobile/userReport`
      let data = {
        reason: this.reportForm.value.reason,
        details: this.reportForm.value.details,
        userId: localStorage.getItem('user_id'),
        Type: 'user'
      }
      this.apiService.postData(url, data).subscribe(result => {
        this.commonService.showLoader = false
        if (result.status = 'true') {
          this.formSubmited = false
          this.reportForm.reset();
          this.commonService.succ(result.message)
          this.closeModel.nativeElement.click()
        }
      }, error => {
        this.apiService.log(error),
          this.commonService.showLoader = false
      })
    } else {
      this.router.navigate(['/user/sign-in'], { queryParams: { 'redirectURL': this.router.url } });
    }
  }
  propertyBooked(property) {
    if (this.userId) {
      this.router.navigate(['/properties', 'book-event', property._id])
    } else {
      this.router.navigate(['/user/sign-in'], { queryParams: { 'redirectURL': this.router.url } });
    }
  }
  sendMessage(receiver_id, propertyId, propertyType) {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/requestMessage`
    let data = {
      sender_id: this.userId,
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
}
