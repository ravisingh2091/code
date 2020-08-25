import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";


import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup
  formSubmited: boolean = false
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.pattern(/^\d+$/), Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      message: ['', Validators.required]
    })
  }

  ngOnInit() {
  }
  contactFormSubmit() {
    this.formSubmited = true
    if (this.contactForm.invalid) {
      return true
    }
    this.commonService.showLoader = true
    let url = `${environment.api_url}contactUs`
    this.apiService.postData(url, this.contactForm.value).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == 'true') {
        this.formSubmited = false
        this.contactForm.reset()
        this.commonService.succ(result.message)
      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }
}
