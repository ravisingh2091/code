import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $

import { CommonService } from "src/app/services/common.service";
import { ApiService } from "src/app/services/api.service";
import { CountryProvider } from "src/app/services/countryCode.provider";
import { HeaderProvider } from "src/app/services/header.provider";
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup
  formSubmited: boolean = false;
  selectedCountory = '+91'
  errorMessage: string = ""
  OtpError: string = ""
  verificationCode: string;
  resendButton: boolean = false
  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    public CountryProvider: CountryProvider,
    private headerProvider: HeaderProvider,
    private router: Router,

  ) {
    this.signUpForm = this.formBuilder.group({
      "name": ['', Validators.required],
      "phone_no": ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      "password": ['', Validators.required],
      "confirm-password": ['', Validators.required],
    }, { validator: this.checkIfMatchingPasswords('password', 'confirm-password') })
  }
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  ngOnInit() {
  }

  onSubmit() {
    this.formSubmited = true
    if (this.signUpForm.invalid) {
      return;
    }
    this.commonService.showLoader = true

    let url = `${environment.api_url}mobile/checkUser`
    this.apiService.postData(url, {
      countryCode: this.selectedCountory,
      mobileNumber: this.signUpForm.value.phone_no
    }).subscribe(checkUser => {
      this.commonService.showLoader = false
      if (checkUser.status == "true") {
        //user exists
        this.errorMessage = checkUser.message
      } else {
        // user does not exists  
        this.sendLoginCode()
        $("#exampleModal").modal('show');
      }
    }, error => {
      console.log({ error })
    })


  }

  sendLoginCode() {
    this.commonService.showLoader = true
    let url = `${environment.api_url}web/sendOtp`
    this.apiService.postData(url, {
      countryCode: this.selectedCountory,
      mobileNumber: this.signUpForm.value.phone_no
    }).subscribe(result => {
      this.commonService.showLoader = false
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })
  }

  verifyLoginCode() {
    this.commonService.showLoader = true
    let urlOtp = `${environment.api_url}web/verifyOtp`
    this.apiService.postData(urlOtp, {
      countryCode: this.selectedCountory,
      mobileNumber: this.signUpForm.value.phone_no,
      otp: this.verificationCode
    }).subscribe(result => {
      if (result.status == "true") {
        let url = `${environment.api_url}mobile/signup`
        let data = {
          'fullName': this.signUpForm.value.name,
          'countryCode': this.selectedCountory,
          'mobileNumber': this.signUpForm.value.phone_no,
          'password': this.signUpForm.value.password,
          'confirmpassword': this.signUpForm.value['confirm-password'],
        }
        this.apiService.postData(url, data).subscribe(response => {
          this.commonService.showLoader = false
          $("#exampleModal").modal('hide');
          if (response.status == "true") {
            localStorage.setItem("user_id", response.data._id)
            this.headerProvider.current.user_id = response.data._id
            this.router.navigate(['/']);
          } else {
            this.errorMessage = response.message
          }
        }, error => {

        })
      } else {
        this.commonService.showLoader = false
        this.OtpError = result.message
        if (result.message == "Otp has been expired, please resend otp.") {

        } else {

        }

      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })













  }

  onSelectCode(a) {
    this.selectedCountory = a
  }


}
