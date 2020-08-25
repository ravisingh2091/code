import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonService } from "src/app/services/common.service";
import { ApiService } from "src/app/services/api.service";
import { CountryProvider } from "src/app/services/countryCode.provider";
import { HeaderProvider } from "src/app/services/header.provider";
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm:FormGroup
  formSubmited : boolean= false
  userId = localStorage.getItem("user_id")
  updateMessage: any;
  errorMessage: any;
  constructor(
    private commonService:CommonService,
    private apiService:ApiService,
    private formBuilder:FormBuilder, 
    public  CountryProvider:CountryProvider, 
    private headerProvider:HeaderProvider, 
    private router:Router, 
  ) { 

   this.changePasswordForm = this.formBuilder.group({
      "old-password":['',Validators.required],
      "password":['',Validators.required],
      "confirm-password":['',Validators.required],
    },{ validator: this.checkIfMatchingPasswords('password', 'confirm-password') })
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
  changePassword(){
    this.formSubmited = true;
    if(this.changePasswordForm.invalid){
      return;
    }
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/resetPassword`;
    let data ={
      userId:this.userId,
      oldPassword:this.changePasswordForm.value['old-password'],
      newPassword:this.changePasswordForm.value.password,
    }
    this.apiService.postData(url,data).subscribe(response=>{
      this.commonService.showLoader = false
      if(response.status == "true"){
        // this.changePasswordForm.reset();
        this.updateMessage = response.message
      }else{
        this.errorMessage = response.message
      }
    },error=>this.apiService.log(error))
    console.log(this.changePasswordForm.value);
  }
}
