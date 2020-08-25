import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


import { ApiService } from "src/app/services/api.service";
import { HeaderProvider } from "src/app/services/header.provider";
import { CommonService } from "src/app/services/common.service";
import { environment } from 'src/environments/environment.prod';
import { CountryProvider } from 'src/app/services/countryCode.provider';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId = localStorage.getItem("user_id")
  selectedCountory: string
  userData: any = {}
  profileForm: FormGroup
  formSubmited: boolean = false;
  updateMessage: string
  errorMessage: string
  profilePic: any
  constructor(
    private apiService: ApiService,
    private headerProvider: HeaderProvider,
    private commonService: CommonService,
    private router: Router,
    public CountryProvider: CountryProvider,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      'fullName': ["", Validators.required],
      'email': ["", Validators.email],
      'country': ["", Validators.required],
      'state': ["", Validators.required],
      'image': [""],
      'mobileNumber': ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    })

  }

  ngOnInit() {
    this.profileDetail();
  }

  onSelectCode(a) {
    this.selectedCountory = a
  }

  profileDetail() {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/getuserDetails`
    this.apiService.postData(url, { userId: this.userId }).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status == "true") {
        this.selectedCountory = response.data.countryCode
        this.userData = response.data
        this.profileForm.patchValue({
          "fullName": this.userData.fullName,
          "email": this.userData.email,
          "mobileNumber": this.userData.mobileNumber,
          "state": this.userData.state,
          "country": this.userData.country
        })


      }

    }, error => this.apiService.log(error))
  }

  fileUpload(event) {
    this.profilePic = event.target.files[0]
  }
  profileSubmit() {

    this.formSubmited = true
    if (this.profileForm.invalid) {
      return;
    }

    this.commonService.showLoader = true

    let url = `${environment.api_url}mobile/updateProfile`

    let formData = new FormData
    if (this.profilePic) {
      formData.append("profileImage", this.profilePic)
    }
    formData.append("fullName", this.profileForm.value.fullName)
    formData.append("country", this.profileForm.value.country)
    formData.append("state", this.profileForm.value.state)
    formData.append("mobileNumber", this.profileForm.value.mobileNumber)
    formData.append("email", this.profileForm.value.email || '')
    formData.append("countryCode", this.selectedCountory)
    formData.append("userId", this.userId)



    this.apiService.formData(url, formData).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status == "true") {
        this.updateMessage = response.message
        this.selectedCountory = response.data.countryCode
        this.userData = response.data
      } else {
        this.errorMessage = response.message
      }
    }, error => this.apiService.log(error))
  }
}
