import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-event',
  templateUrl: './book-event.component.html',
  styleUrls: ['./book-event.component.css']
})
export class BookEventComponent implements OnInit {
  propertyId: string;
  propertyDetail: any;
  eventData = [];
  apiResponse = false
  bookEventForm: FormGroup
  formSubmited: boolean = false
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.propertyId = this.route.snapshot.paramMap.get("property_id");
    this.bookEventForm = this.fb.group({
      selected_date: ['', Validators.required],
      // start_time: ['', Validators.required],
      // end_time: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.getPropertyDetail()
  }

  getPropertyDetail() {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/bookedDates/${this.propertyId}`
    this.apiService.getData(url).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status = "true") {
        this.propertyDetail = result.data
        // this.eventData
        this.propertyDetail.selectDate.map(value => {
          this.eventData.push({
            date: value.date,
            title: `Available`,
            specialOffer: value.specialOffer
          })
        })
        this.apiResponse = true
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }


  avlClick(data) {
    var unique = data.filter(this.onlyUnique);
    this.bookEventForm.patchValue({
      selected_date: unique.join(",")
    })
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  eventBook() {
    this.formSubmited = true
    if (this.bookEventForm.invalid) {
      return
    }
    let url = `${environment.api_url}mobile/requestBooking`
    let data = {
      propertyId: this.propertyId,
      propertyType: this.propertyDetail.Type,
      sender_id: localStorage.getItem("user_id"),
      receiver_id: this.propertyDetail.ownerId,
      requestDate: this.bookEventForm.value.selected_date.split(","),
      // startTime: this.bookEventForm.value.start_time,
      // endTime: this.bookEventForm.value.end_time
    }
    this.commonService.showLoader = true
    this.apiService.postData(url, data).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.commonService.succ(result.message)
        this.router.navigate(['/properties/properties-details', this.propertyId])
      } else {
        this.commonService.err(result.message)
        // this.router.navigate(['/properties/properties-details', this.propertyId])
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }
}
