import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Router } from "@angular/router";
declare var google

import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-post-services',
  templateUrl: './post-services.component.html',
  styleUrls: ['./post-services.component.css']
})
export class PostServicesComponent implements OnInit {
  fullForm: boolean = false
  formSubmited: boolean = false
  specialOffer: boolean = false
  postServiceForm: FormGroup
  subCategoriesLists = []
  latitude = 28.5355;
  longitude = 77.3910;
  zoom = 8;
  address: any;
  addSitesForm: any;
  previousUploadImage = []
  uploadFileUrls = []
  uploadFile = []
  // govIdFile1: any
  // govIdFile2: any
  private geoCoder;
  errorMessage: string
  succMessage: string
  servicePrevioudDetail: any;
  providerId = ''
  language: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
  ) {
    this.postServiceForm = this.fb.group({
      accountStatus: ['', Validators.required],
      company_name: ['', Validators.required],
      category_name: ['', Validators.required],
      sub_category_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d/), Validators.minLength(6)]],
      govtIdType1: ['', Validators.required],
      govtIdNumber1: ['', Validators.required],
      govtIdImage1: ['', Validators.required],
      govtIdType2: ['', Validators.required],
      govtIdNumber2: ['', Validators.required],
      govtIdImage2: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
      area: ['', Validators.required],
      upload_file: [''],
      working_day_sunday: ['Sunday'],
      start_time_sunday: [''],
      end_time_sunday: [''],
      working_day_monday: ['Monday'],
      start_time_monday: [''],
      end_time_monday: [''],
      working_day_tuesday: ['Tuesday'],
      start_time_tuesday: [''],
      end_time_tuesday: [''],
      working_day_wednesday: ['Wednesday'],
      start_time_wednesday: [''],
      end_time_wednesday: [''],
      working_day_thursday: ['Thursday'],
      start_time_thursday: [''],
      end_time_thursday: [''],
      working_day_friday: ['Friday'],
      start_time_friday: [''],
      end_time_friday: [''],
      working_day_saturday: ['Saturday'],
      start_time_saturday: [''],
      end_time_saturday: [''],
      description: [''],
      specialOffer: ['false'],
      serviceNameArray: this.fb.array([])
    })
    this.language = this.commonService.language;
    this.commonService._lang.subscribe(result => {
      this.language = result;
    })
  }

  createItem(): FormGroup {
    return this.fb.group({
      service_name: [''],
    });
  }

  get serviceNameArray() {
    return this.postServiceForm.get('serviceNameArray') as FormArray;
  }
  addItem(): void {
    this.serviceNameArray.push(this.createItem());
  }
  removeItem(): void {
    this.serviceNameArray.removeAt(this.serviceNameArray.length - 1)
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.setCurrentLocation()
    });
    this.getuserDetails()
  }

  getuserDetails() {
    let url = `${environment.api_url}mobile/getuserDetails`;
    this.apiService.postData(url, { userId: localStorage.getItem('user_id') }).subscribe(result => {
      if (result.status == "true") {
        if (result.data.profile) {
          this.servicePrevioudDetail = result.data.profile
          if (this.servicePrevioudDetail) {
            this.getSubCategory({
              target: {
                value: this.servicePrevioudDetail.category == "Architecture & Interior" ? "archInterior" : "afterSales"
              }
            })
            this.postServiceForm.patchValue({
              category_name: this.servicePrevioudDetail.category == "Architecture & Interior" ? "archInterior" : "afterSales",
              sub_category_name: this.servicePrevioudDetail.subCategory,
            })

          }
        }
      }
    }, error => this.apiService.log("Something went wrong"))
  }
  patchForm() {
    if (this.servicePrevioudDetail == null) {
      this.addItem()
    }

    if (this.servicePrevioudDetail) {

      this.providerId = this.servicePrevioudDetail._id
      this.previousUploadImage = this.servicePrevioudDetail.imagesFile
      this.postServiceForm.get('govtIdImage1').clearValidators();
      this.postServiceForm.get('govtIdImage2').clearValidators();
      this.postServiceForm.get('govtIdImage1').updateValueAndValidity();
      this.postServiceForm.get('govtIdImage2').updateValueAndValidity();
      let subCate = this.servicePrevioudDetail.services.split(",").map(index => {
        this.addItem()
        return {
          service_name: index
        }
      })
      let timming = this.servicePrevioudDetail.selectTime.split(",");
      let Sunday = this.servicePrevioudDetail.selectDays.split(",").indexOf("Sunday")
      let Monday = this.servicePrevioudDetail.selectDays.split(",").indexOf("Monday")
      let Tuesday = this.servicePrevioudDetail.selectDays.split(",").indexOf("Tuesday")
      let Wednesday = this.servicePrevioudDetail.selectDays.split(",").indexOf("Wednesday")
      let Thursday = this.servicePrevioudDetail.selectDays.split(",").indexOf("Thursday")
      let Friday = this.servicePrevioudDetail.selectDays.split(",").indexOf("Friday")
      let Saturday = this.servicePrevioudDetail.selectDays.split(",").indexOf("Saturday")

      this.postServiceForm.patchValue({
        accountStatus: this.servicePrevioudDetail.accountStatus,
        company_name: this.servicePrevioudDetail.cmpName,
        email: this.servicePrevioudDetail.email,
        phone: this.servicePrevioudDetail.phone,
        govtIdType1: this.servicePrevioudDetail.govtIdType1,
        govtIdNumber1: this.servicePrevioudDetail.govtIdNumber1,
        govtIdType2: this.servicePrevioudDetail.govtIdType2,
        govtIdNumber2: this.servicePrevioudDetail.govtIdNumber2,
        state: this.servicePrevioudDetail.state,
        city: this.servicePrevioudDetail.city,
        zipcode: this.servicePrevioudDetail.zipcode,
        area: this.servicePrevioudDetail.area,
        description: this.servicePrevioudDetail.description,
        specialOffer: this.servicePrevioudDetail.specialOffer.toString(),
        serviceNameArray: subCate,
        start_time_sunday: Sunday != -1 ? timming[Sunday].split("-")[0] : '',
        end_time_sunday: Sunday != -1 ? timming[Sunday].split("-")[1] : '',
        start_time_monday: Monday != -1 ? timming[Monday].split("-")[0] : '',
        end_time_monday: Monday != -1 ? timming[Monday].split("-")[1] : '',
        start_time_tuesday: Tuesday != -1 ? timming[Tuesday].split("-")[0] : '',
        end_time_tuesday: Tuesday != -1 ? timming[Tuesday].split("-")[1] : '',
        start_time_wednesday: Wednesday != -1 ? timming[Wednesday].split("-")[0] : '',
        end_time_wednesday: Wednesday != -1 ? timming[Wednesday].split("-")[1] : '',
        start_time_thursday: Thursday != -1 ? timming[Thursday].split("-")[0] : '',
        end_time_thursday: Thursday != -1 ? timming[Thursday].split("-")[1] : '',
        start_time_friday: Friday != -1 ? timming[Friday].split("-")[0] : '',
        end_time_friday: Friday != -1 ? timming[Friday].split("-")[1] : '',
        start_time_saturday: Saturday != -1 ? timming[Saturday].split("-")[0] : '',
        end_time_saturday: Saturday != -1 ? timming[Saturday].split("-")[1] : '',
      })
      this.address = this.servicePrevioudDetail.address
      this.getAddress(parseFloat(this.servicePrevioudDetail.lat), parseFloat(this.servicePrevioudDetail.long));
    }


  }
  private setCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.zoom = 8;
      this.getAddress(this.latitude, this.longitude);
    });
  }

  mapClickCheck($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }


  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          let zipcode
          let city
          let state
          let area
          for (var j = 0; j < results[0].address_components.length; j++) {
            for (var k = 0; k < results[0].address_components[j].types.length; k++) {
              if (results[0].address_components[j].types[k] == "postal_code") {
                zipcode = results[0].address_components[j].long_name;
              }
              if (results[0].address_components[j].types[k] == "administrative_area_level_1") {
                state = results[0].address_components[j].long_name;
              }
              if (results[0].address_components[j].types[k] == "locality") {
                city = results[0].address_components[j].long_name;
              }
              if (results[0].address_components[j].types[k] == "sublocality_level_1") {
                area = results[0].address_components[j].long_name;
              }
            }
          }

          this.postServiceForm.patchValue({
            state,
            city,
            area,
            zipcode: zipcode,
          })
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  getSubCategory(category) {
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/getPropCategory`;
    this.apiService.postData(url, { Type: category.target.value }).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.subCategoriesLists = result.data
        this.patchForm()
      }
    }, error => this.apiService.log(error))

    if (category.target.value == 'afterSales') {
      this.specialOffer = true
      this.postServiceForm.get('specialOffer').setValidators([Validators.required])
    } else {
      this.specialOffer = false
      this.postServiceForm.get('specialOffer').clearValidators();
    }
    this.postServiceForm.get('specialOffer').updateValueAndValidity();
  }


  selectImages(event) {
    var file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadFileUrls.push(e.target.result);
      }
      reader.readAsDataURL(file);
      this.uploadFile.push(file)
    }
    this.postServiceForm.patchValue({ "upload_file": "" })
  }

  govIdImage(image, event) {
    // this['govIdFile' + image] = event.target.files[0]
  }
  removeUploadFile(img, i) {
    if (img === "previous") {
      this.previousUploadImage = this.previousUploadImage.filter((data, index) => index != i)
    } else {
      this.uploadFileUrls = this.uploadFileUrls.filter((data, index) => index != i)
      this.uploadFile = this.uploadFile.filter((data, index) => index != i)
    }

  }



  postService() {

    this.formSubmited = true
    if (this.postServiceForm.invalid) {
      return;
    }

    this.commonService.showLoader = true
    let formData = new FormData()
    formData.append("accountStatus", this.postServiceForm.value.accountStatus)
    formData.append("cmpName", this.postServiceForm.value.company_name)
    formData.append("category", this.postServiceForm.value.category_name == "archInterior" ? "Architecture & Interior" : "After Sales")
    formData.append("subCategory", this.postServiceForm.value.sub_category_name)
    formData.append("email", this.postServiceForm.value.email)
    formData.append("userId", localStorage.getItem("user_id"))
    formData.append("phone", this.postServiceForm.value.phone)
    formData.append("govtIdType1", this.postServiceForm.value.govtIdType1)
    formData.append("govtIdType2", this.postServiceForm.value.govtIdType2)
    formData.append("govtIdNumber1", this.postServiceForm.value.govtIdNumber1)
    formData.append("govtIdNumber2", this.postServiceForm.value.govtIdNumber2)
    formData.append("state", this.postServiceForm.value.state)
    formData.append("city", this.postServiceForm.value.city)
    formData.append("zipcode", this.postServiceForm.value.zipcode)
    formData.append("area", this.postServiceForm.value.area)
    formData.append("lat", this.latitude.toString())
    formData.append("long", this.longitude.toString())
    formData.append("specialOffer", this.postServiceForm.value.specialOffer)
    formData.append("Type", this.postServiceForm.value.category_name)
    let DaysList = []
    let TimeList = []
    if (this.postServiceForm.value.start_time_sunday) {
      DaysList.push("Sunday")
      TimeList.push(this.postServiceForm.value.start_time_sunday + '-' + this.postServiceForm.value.end_time_sunday)
    }
    if (this.postServiceForm.value.start_time_monday) {
      DaysList.push("Monday")
      TimeList.push(this.postServiceForm.value.start_time_monday + '-' + this.postServiceForm.value.end_time_monday)
    }
    if (this.postServiceForm.value.start_time_tuesday) {
      DaysList.push("Tuesday")
      TimeList.push(this.postServiceForm.value.start_time_tuesday + '-' + this.postServiceForm.value.end_time_tuesday)
    }
    if (this.postServiceForm.value.start_time_wednesday) {
      DaysList.push("Wednesday")
      TimeList.push(this.postServiceForm.value.start_time_wednesday + '-' + this.postServiceForm.value.end_time_wednesday)
    }
    if (this.postServiceForm.value.start_time_tuesday) {
      DaysList.push("Thursday")
      TimeList.push(this.postServiceForm.value.start_time_tuesday + '-' + this.postServiceForm.value.end_time_tuesday)
    }
    if (this.postServiceForm.value.start_time_friday) {
      DaysList.push("Friday")
      TimeList.push(this.postServiceForm.value.start_time_friday + '-' + this.postServiceForm.value.end_time_friday)
    }
    if (this.postServiceForm.value.start_time_saturday) {
      DaysList.push("Saturday")
      TimeList.push(this.postServiceForm.value.start_time_saturday + '-' + this.postServiceForm.value.end_time_saturday)
    }

    formData.append("selectDays", DaysList.join(","))
    formData.append("selectTime", TimeList.join(","))


    for (let i = 0; i < this.uploadFile.length; i++) {
      formData.append(`images[${i}]`, this.uploadFile[i])
    }
    formData.append("description", this.postServiceForm.value.description)
    formData.append("address", this.address)
    var services = []
    this.postServiceForm.value.serviceNameArray.map(value => {
      if (value.service_name != '') {
        services.push(value.service_name)
      }
    })

    formData.append("services", services.join(","))
    let url
    if (this.providerId) {
      url = `${environment.api_url}mobile/updateServiceProfile`
      formData.append("providerId", this.providerId)
    } else {
      url = `${environment.api_url}mobile/createServiceProfile`
    }



    this.apiService.formData(url, formData).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status = "true") {
        this.succMessage = result.message
        this.commonService.succ(result.message);
        this.router.navigate(['/user/profile'])
      } else {
        this.errorMessage = result.message
      }
    }, error => console.log(error))
  }

}
