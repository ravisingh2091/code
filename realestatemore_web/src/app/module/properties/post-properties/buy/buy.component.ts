import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Router } from '@angular/router';
declare var google
declare var $

import { PostStaticData } from "../post-static-data";
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-buy',
    templateUrl: './buy.component.html',
    styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
    postPropForm: FormGroup
    showForm: number = 1
    hasBalcony: boolean = false
    hasGarden: boolean = false
    hasModularKitchen: boolean = false
    hasParking: boolean = false
    numberList = []
    yearList = []
    formSubmited: boolean = false
    indoorData: any = PostStaticData.indoor
    outdoorData: any = PostStaticData.outdoor
    furnishingData: any = PostStaticData.furnishing
    parkingsData: any = PostStaticData.parking
    viewData: any = PostStaticData.view
    private geoCoder;
    latitude = 28.5355;
    longitude = 77.3910;
    zoom = 8;
    uploadFileUrls = []
    uploadFile = []
    imageCaption = []
    caption = ''
    categoryLists: any;
    language: any;
    constructor(
        private fb: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private apiService: ApiService,
        private commonService: CommonService,
        private router: Router
    ) {
        this.postPropForm = this.fb.group({
            title: ['', Validators.required],
            categories: ['', Validators.required],
            status: ['', Validators.required],
            purpose: ['', Validators.required],
            available_for: ['', Validators.required],
            bedrooms: ['', Validators.required],
            bathrooms: ['', Validators.required],
            kitchens: ['', Validators.required],
            floors: ['', Validators.required],
            no_of_living_room: [''],
            plot_size: ['', Validators.required],
            plot_size_in: ['Sq. Meter', Validators.required],
            built_size: ['', Validators.required],
            built_size_in: ['Sq. Meter', Validators.required],
            length_size: ['', Validators.required],
            length_in: ['Meter', Validators.required],
            width_size: ['', Validators.required],
            width_size_in: ['Meter', Validators.required],
            built_year: ['', Validators.required],
            street_view: ['', Validators.required],
            description: ['', Validators.required],
            street_width: ['', Validators.required],
            street_width_in: ['Meter', Validators.required],
            appartment: ['', Validators.required],
            no_of_showroom: ['', Validators.required],
            no_of_office: [''],
            no_of_stores: [''],
            near_by_services: [''],
            balcony: ['false', Validators.required],
            garden: ['false', Validators.required],
            parking: ['false', Validators.required],
            kitchen: ['false', Validators.required],
            lift: ['false', Validators.required],
            duplex: ['false', Validators.required],
            ac: ['false', Validators.required],
            bbq: ['false', Validators.required],
            football_area: ['false', Validators.required],
            green_area: ['false', Validators.required],
            volleyball: ['false', Validators.required],
            playground: ['false', Validators.required],
            wifi: ['false', Validators.required],
            indoor: this.createFormArray(this.indoorData),
            outdoor: this.createFormArray(this.outdoorData),
            furnishing: this.createFormArray(this.furnishingData),
            parkings: this.createFormArray(this.parkingsData),
            view: this.createFormArray(this.viewData),
            prices_per_meter: ['', Validators.required],
            total: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
            size: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
            province: ['', Validators.required],
            city: ['', Validators.required],
            district: ['', Validators.required],
            address: ['', Validators.required],
            building_name: ['', Validators.required],
            additional_number: ['', Validators.required],
            street_name: ['', Validators.required],
            zip: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
            upload_file: [''],
            payment_method: ['Debit Card', Validators.required],
            Furnished: ['false', Validators.required],
            Garage: ['false', Validators.required],
            BathroomforMen: ['false', Validators.required],
            BathroomforLady: ['false', Validators.required],
        })

        for (let i = 0; i <= 100; i++) {
            this.numberList = [...this.numberList, i]
        }

        for (let i = new Date().getFullYear(); i >= 1900; i--) {
            this.yearList = [...this.yearList, i]
        }


        this.language = this.commonService.language;
        this.commonService._lang.subscribe(result => {
            this.language = result;
        })
    }
    createFormArray(createFor) {
        const arr = createFor.map(data => {
            return new FormControl(false);
        });
        return new FormArray(arr);
    }
    ngOnInit() {
        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;
            this.setCurrentLocation()
        });
        this.categoryData("buy")
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
                    let zipcode
                    let city
                    for (var j = 0; j < results[0].address_components.length; j++) {
                        for (var k = 0; k < results[0].address_components[j].types.length; k++) {
                            if (results[0].address_components[j].types[k] == "postal_code") {
                                zipcode = results[0].address_components[j].long_name;
                            }

                            if (results[0].address_components[j].types[k] == "locality") {
                                city = results[0].address_components[j].long_name;
                            }

                        }
                    }

                    this.postPropForm.patchValue({
                        city,
                        zip: zipcode,
                        address: results[0].formatted_address
                    })
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }

        });
    }

    onSubmit() {
        this.formSubmited = true
        if (this.postPropForm.invalid) {
            return
        }

        let formData = new FormData();
        formData.append("title", this.postPropForm.value.title)
        formData.append("userId", localStorage.getItem('user_id'))
        formData.append("Type", "buy")
        formData.append("category", this.postPropForm.value.categories)
        formData.append("status", this.postPropForm.value.status)
        formData.append("purpose", this.postPropForm.value.purpose)
        formData.append("available", this.postPropForm.value.available_for)
        formData.append("bedrooms", this.postPropForm.value.bedrooms)
        formData.append("bathrooms", this.postPropForm.value.bathrooms)
        formData.append("kitchens", this.postPropForm.value.kitchens)
        formData.append("builtSize", this.postPropForm.value.built_size)
        formData.append("floor", this.postPropForm.value.floors)
        formData.append("description", this.postPropForm.value.description)
        formData.append("builtSizeUnit", this.postPropForm.value.built_size_in)
        formData.append("plotSize", this.postPropForm.value.plot_size)
        formData.append("plotSizeUnit", this.postPropForm.value.plot_size_in)
        formData.append("length", this.postPropForm.value.length_size)
        formData.append("lengthUnit", this.postPropForm.value.length_in)
        formData.append("width", this.postPropForm.value.width_size)
        formData.append("widthUnit", this.postPropForm.value.width_size_in)
        formData.append("yearBuilt", this.postPropForm.value.built_year)
        formData.append("streetView", this.postPropForm.value.street_view)
        formData.append("streetWidth", this.postPropForm.value.street_width)
        formData.append("streetWidthUnit", this.postPropForm.value.street_width_in)
        formData.append("extrabuildingNo", this.postPropForm.value.appartment)
        formData.append("extrashowroomNo", this.postPropForm.value.no_of_showroom)
        formData.append("balcony", this.postPropForm.value.balcony)
        formData.append("garden", this.postPropForm.value.garden)
        formData.append("parking", this.postPropForm.value.parking)
        formData.append("modularKitchen", this.postPropForm.value.kitchen)
        formData.append("indoor", this.getCheboxValue('indoor'))
        formData.append("outdoor", this.getCheboxValue('outdoor'))
        formData.append("furnish", this.getCheboxValue('furnishing'))
        formData.append("parkingOption", this.getCheboxValue('parkings'))
        formData.append("view", this.getCheboxValue('view'))
        formData.append("sizem2", this.postPropForm.value.size)
        formData.append("totalPrice", this.postPropForm.value.total)
        formData.append("pricePerMeter", this.postPropForm.value.prices_per_meter)
        formData.append("province", this.postPropForm.value.province)
        formData.append("city", this.postPropForm.value.city)
        formData.append("district", this.postPropForm.value.district)
        formData.append("address", this.postPropForm.value.address)
        formData.append("zipcode", this.postPropForm.value.zip)
        formData.append("additionalNo", this.postPropForm.value.additional_number)
        formData.append("streetName", this.postPropForm.value.street_name)
        formData.append("buildingNo", this.postPropForm.value.building_name)
        formData.append("paymentMethod", this.postPropForm.value.payment_method)
        formData.append("nearSevices", this.postPropForm.value.near_by_services)

        formData.append("livingRooms", this.postPropForm.value.no_of_living_room)
        formData.append("lift", this.postPropForm.value.lift)
        formData.append("duplex", this.postPropForm.value.duplex)
        formData.append("airConditioner", this.postPropForm.value.ac)
        formData.append("noOfOfficeOrSize", this.postPropForm.value.no_of_office)
        formData.append("noOfStores", this.postPropForm.value.no_of_stores)

        formData.append("bbq", this.postPropForm.value.bbq)
        formData.append("footballArea", this.postPropForm.value.football_area)
        formData.append("greenArea", this.postPropForm.value.green_area)
        formData.append("volleyBall", this.postPropForm.value.volleyball)
        formData.append("playGround", this.postPropForm.value.playground)
        formData.append("wifi", this.postPropForm.value.wifi)
        formData.append("furniture", this.postPropForm.value.Furnished)
        formData.append("garage", this.postPropForm.value.Garage)
        formData.append("bathroomLady", this.postPropForm.value.BathroomforLady)
        formData.append("bathroomMen", this.postPropForm.value.BathroomforMen)




        formData.append("lat", this.latitude.toString())
        formData.append("long", this.longitude.toString())
        for (let i = 0; i < this.uploadFile.length; i++) {
            formData.append(`images[${i}]`, this.uploadFile[i])
        }
        for (let i = 0; i < this.imageCaption.length; i++) {
            formData.append(`imageCaption[${i}]`, this.imageCaption[i])
        }
        let url = `${environment.api_url}mobile/postProperty`
        this.commonService.showLoader = true

        this.apiService.formData(url, formData).subscribe(result => {
            this.commonService.showLoader = false
            if (result.status == "true") {
                this.router.navigate(['/properties/manage-properties'])
            }
        }, error => {
            this.commonService.showLoader = false
            this.apiService.log(error)
        })



    }

    getCheboxValue(controlName) {
        let result = this.postPropForm.controls[controlName]['controls'].map((indoor, i) => {
            return indoor.value && this[controlName + "Data"][i].value
        })

        let finalResult = result.filter((value) => {
            if (value !== false) {
                return value
            }
        })

        return finalResult.join(",")
    }

    showModel(event) {
        var file = event.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
                this.uploadFileUrls.push(e.target.result);
            }

            reader.readAsDataURL(file);
            this.uploadFile.push(file)
        }
        this.postPropForm.patchValue({ "upload_file": "" })
        $("#imageModel").modal("show")
    }
    closeModel() {
        this.uploadFileUrls.pop()
        this.uploadFile.pop()
        this.caption = ''
    }
    selectImages() {
        this.imageCaption.push(this.caption)
        this.caption = ''
        $("#imageModel").modal("hide")
    }

    categoryData(Type) {
        this.commonService.showLoader = true
        let url = `${environment.api_url}mobile/getPropCategory`
        this.apiService.postData(url, { Type }).subscribe(result => {
            this.commonService.showLoader = false
            if (result.status == "true") {
                this.categoryLists = result.data
            }
        }, error => {
            this.commonService.showLoader = false
            this.apiService.log(error)
        })
    }
}