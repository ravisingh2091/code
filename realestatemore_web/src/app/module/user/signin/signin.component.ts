import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $

import { CommonService } from "src/app/services/common.service";
import { ApiService } from "src/app/services/api.service";
import { CountryProvider } from 'src/app/services/countryCode.provider';
import { environment } from 'src/environments/environment';
import { HeaderProvider } from 'src/app/services/header.provider';
// import { WindowService } from 'src/app/services/window.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup
  formSubmited: boolean = false;
  mobileScreen: boolean = true;
  selectedCountory = '+91'
  errorMessage: string
  errorOtpMessage: string
  windowRef: any;
  verificationCode: string;
  sendOtpScreen: boolean = false
  phoneNumber: any;
  passwordErrorMessage: any;
  confirmPassword: boolean = false
  change_password: any
  change_confirm_password: any
  passwordChangeMessage: any
  redirectURL: any;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    public CountryProvider: CountryProvider,
    private headerProvider: HeaderProvider,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.redirectURL = this.route.snapshot.queryParams['redirectURL'];

    this.loginForm = this.formBuilder.group({
      "phone_no": ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      "password": ['', Validators.required],
    })

  }

  ngOnInit() {

  }
  onSelectCode(a) {
    this.selectedCountory = a
  }

  onSubmit() {

    this.formSubmited = true
    if (this.loginForm.invalid) {
      return;
    }
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/login`
    let data = {
      'countryCode': this.selectedCountory,
      'mobileNumber': this.loginForm.value.phone_no,
      'password': this.loginForm.value.password,
    }

    this.apiService.postData(url, data).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status == "true") {
        localStorage.setItem("user_id", response.data._id)
        localStorage.setItem("name", response.data.fullName)
        localStorage.setItem("image", response.data.profileImage)
        this.headerProvider.current.user_id = response.data._id

        if (this.redirectURL) {
          this.router.navigateByUrl(this.redirectURL)
        } else {
          this.router.navigateByUrl('/');
        }
      }
      this.errorMessage = response.message
    }, error => {

    })
  }

  sendOtpToUser() {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/checkUser`
    this.apiService.postData(url, {
      countryCode: this.selectedCountory,
      mobileNumber: this.phoneNumber
    }).subscribe(checkUser => {
      if (checkUser.status == "true") {
        //user exists
        this.commonService.showLoader = true
        let urlOtp = `${environment.api_url}web/sendOtp`
        this.apiService.postData(urlOtp, {
          countryCode: this.selectedCountory,
          mobileNumber: this.phoneNumber
        }).subscribe(result => {
          this.commonService.showLoader = false
          this.sendOtpScreen = true
          this.mobileScreen = false
        }, error => {
          this.commonService.showLoader = false
          this.apiService.log(error)
        })
      } else {
        // user does not exists  
        this.commonService.showLoader = false
        this.errorOtpMessage = checkUser.message
      }
    }, error => {
      this.commonService.showLoader = false
      console.log({ error })
    })
  }

  verifyOTPCode() {
    this.commonService.showLoader = true
    let urlOtp = `${environment.api_url}web/verifyOtp`
    this.apiService.postData(urlOtp, {
      countryCode: this.selectedCountory,
      mobileNumber: this.phoneNumber,
      otp: this.verificationCode
    }).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.confirmPassword = true
        this.sendOtpScreen = false
      } else {

        this.errorOtpMessage = result.message
        if (result.message == "Otp has been expired, please resend otp.") {

        } else {

        }

      }
    }, error => {
      this.commonService.showLoader = false
      this.apiService.log(error)
    })



  }

  changePassword() {
    if (this.change_password == '') {
      this.passwordErrorMessage = "Password is required"
      return
    }
    if (this.change_confirm_password == '') {
      this.passwordErrorMessage = "Confirm Password is required"
      return
    }

    let url = `${environment.api_url}mobile/forgotPassowrd`;
    let data = {
      countryCode: this.selectedCountory,
      mobileNumber: this.phoneNumber,
      password: this.change_password
    }
    this.apiService.postData(url, data).subscribe(response => {
      if (response.status == "true") {
        $("#exampleModal").modal("hide")
        this.passwordChangeMessage = response.message
      } else {
        this.passwordErrorMessage = response.message
      }
    }, error => this.apiService.log(error))
  }

}
