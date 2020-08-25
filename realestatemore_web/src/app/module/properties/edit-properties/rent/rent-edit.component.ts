import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Router } from '@angular/router';
declare var google
declare var $

import { PostStaticData } from "../../post-properties/post-static-data";
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-rent-edit',
    templateUrl: './rent-edit.component.html',
    styleUrls: ['./rent-edit.component.css']
})
export class RentEditComponent implements OnInit, AfterViewInit {
    @Input() propertyId: string
    postPropForm: FormGroup
    showForm: number = 7
    hasBalcony: boolean = false
    hasGarden: boolean = false
    hasModularKitchen: boolean = false
    hasParking: boolean = false
    rent: boolean = true
    rentEvent: boolean = false
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
    propertyDetail: any;
    eventData = []
    offerDate: boolean;
    constructor(
        private fb: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private apiService: ApiService,
        private commonService: CommonService,
        private router: Router,
    ) {
        this.postPropForm = this.fb.group({
            title: ['', Validators.required],
            available_for_booking: [''],
            categories: ['', Validators.required],
            status: ['', Validators.required],
            purpose: ['', Validators.required],
            available_for: ['', Validators.required],
            bedrooms: ['', Validators.required],
            bathrooms: ['', Validators.required],
            kitchens: ['', Validators.required],
            description: ['', Validators.required],
            floors: ['', Validators.required],
            plot_size: ['', Validators.required],
            plot_size_in: ['', Validators.required],
            built_size: ['', Validators.required],
            built_size_in: ['', Validators.required],
            length_size: ['', Validators.required],
            length_in: ['', Validators.required],
            width_size: ['', Validators.required],
            width_size_in: ['', Validators.required],
            built_year: ['', Validators.required],
            street_view: ['', Validators.required],
            street_width: ['', Validators.required],
            street_width_in: ['', Validators.required],
            appartment: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
            price_with_buffet: ['', Validators.pattern(/[0-9]/)],
            price_without_buffet: ['', Validators.pattern(/[0-9]/)],
            no_of_chairs: ['', Validators.pattern(/[0-9]/)],
            price_based_on: ['Hourly'],
            hall_size: [''],
            no_of_showroom: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
            insurance: ['false', Validators.required],
            kosha: ['false', Validators.required],
            sound_system: ['false', Validators.required],
            projector: ['false', Validators.required],
            speakers: ['false', Validators.required],
            microphone: ['false', Validators.required],
            guest_house: ['false', Validators.required],
            balcony: ['', Validators.required],
            garden: ['', Validators.required],
            parking: ['', Validators.required],
            kitchen: ['', Validators.required],
            indoor: this.createFormArray(this.indoorData),
            outdoor: this.createFormArray(this.outdoorData),
            furnishing: this.createFormArray(this.furnishingData),
            parkings: this.createFormArray(this.parkingsData),
            view: this.createFormArray(this.viewData),
            rent_time: ['', Validators.required],
            size: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
            total: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
            special_offer: [''],
            selected_date: [''],
            selected_offer_date: [''],
            province: ['', Validators.required],
            city: ['', Validators.required],
            district: ['', Validators.required],
            address: ['', Validators.required],
            building_name: ['', Validators.required],
            additional_number: ['', Validators.required],
            street_name: ['', Validators.required],
            zip: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
            upload_file: [''],
            payment_method: ['', Validators.required],
            no_of_living_room: [''],
            lift: ['false', Validators.required],
            ac: ['false', Validators.required],
            Furnished: ['false', Validators.required],
            BathroomforLady: ['false', Validators.required],
            BathroomforMen: ['false', Validators.required],
            duplex: ['false', Validators.required],
            Garage: ['false', Validators.required],
            avaliableAm: ['false', Validators.required],
            avaliablePm: ['false', Validators.required],
            no_of_pool: [''],
            bbq: ['false', Validators.required],
            valleball: ['false', Validators.required],
            football: ['false', Validators.required],
            plyground: ['false', Validators.required],
            Wifi: ['false', Validators.required],
            greenArea: ['false', Validators.required],
            near_by_services: [''],
            no_of_office: [''],
            no_of_stores: [''],
            no_of_tables: [''],
        })

        for (let i = 0; i <= 100; i++) {
            this.numberList = [...this.numberList, i]
        }
        for (let i = new Date().getFullYear(); i >= 1900; i--) {
            this.yearList = [...this.yearList, i]
        }
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

    forBooking(event) {
        if (event.target.value == 'Yes') {
            this.rentEvent = true
            this.rent = false
            this.postPropForm.get('special_offer').setValidators([Validators.required])
            this.postPropForm.get('rent_time').clearValidators()
            this.postPropForm.get('size').clearValidators()
            this.categoryData("rentEvent")
        } else {
            this.rent = true
            this.rentEvent = false
            this.postPropForm.get('special_offer').clearValidators()
            this.postPropForm.get('rent_time').setValidators([Validators.required])
            this.postPropForm.get('size').setValidators([Validators.required, Validators.pattern(/[0-9]/)])
            this.categoryData("rent")
        }
        this.postPropForm.get('special_offer').updateValueAndValidity();
        this.postPropForm.get('rent_time').updateValueAndValidity();
        this.postPropForm.get('size').updateValueAndValidity();
    }


    onSubmit() {
        this.formSubmited = true
        if (this.postPropForm.invalid) {
            return
        }

        let formData = new FormData();
        formData.append("title", this.postPropForm.value.title)
        formData.append("userId", localStorage.getItem('user_id'))
        let available_for_booking
        if (!this.rent) {
            available_for_booking = "buy"
        }
        if (this.rent) {
            available_for_booking = "rent"
        }
        if (this.rentEvent) {
            available_for_booking = "rentevent"
        }

        formData.append("Type", available_for_booking)
        formData.append("propertyId", this.propertyId)
        formData.append("category", this.postPropForm.value.categories)
        formData.append("status", this.postPropForm.value.status)
        formData.append("purpose", this.postPropForm.value.purpose)
        formData.append("available", this.postPropForm.value.available_for)
        formData.append("bedrooms", this.postPropForm.value.bedrooms)
        formData.append("bathrooms", this.postPropForm.value.bathrooms)
        formData.append("kitchens", this.postPropForm.value.kitchens)
        formData.append("floor", this.postPropForm.value.floors)
        formData.append("builtSize", this.postPropForm.value.built_size)
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
        formData.append("rentTime", this.postPropForm.value.rent_time)
        formData.append("sizem2", this.postPropForm.value.size)
        formData.append("totalPrice", this.postPropForm.value.total)
        formData.append("specialOffer", this.postPropForm.value.special_offer)
        formData.append("province", this.postPropForm.value.province)
        formData.append("city", this.postPropForm.value.city)
        formData.append("district", this.postPropForm.value.district)
        formData.append("address", this.postPropForm.value.address)
        formData.append("zipcode", this.postPropForm.value.zip)
        formData.append("additionalNo", this.postPropForm.value.additional_number)
        formData.append("streetName", this.postPropForm.value.street_name)
        formData.append("buildingNo", this.postPropForm.value.building_name)
        formData.append("paymentMethod", this.postPropForm.value.payment_method)
        formData.append("selectDate", this.postPropForm.value.selected_date)
        formData.append("specialOfferDate", this.postPropForm.value.selected_offer_date)

        formData.append("description", this.postPropForm.value.description)
        formData.append("priceWithBuffet", this.postPropForm.value.price_with_buffet)
        formData.append("priceWithoutBuffet", this.postPropForm.value.price_without_buffet)
        formData.append("noOfChairs", this.postPropForm.value.no_of_chairs)
        formData.append("noOfTables", this.postPropForm.value.no_of_tables)
        formData.append("soundSystems", this.postPropForm.value.speakers)
        formData.append("insurance", this.postPropForm.value.insurance)
        formData.append("priceBasedOn", this.postPropForm.value.price_based_on)
        formData.append("hallSize", this.postPropForm.value.hall_size)
        formData.append("hallSize", this.postPropForm.value.hall_size)
        formData.append("projector", this.postPropForm.value.projector)
        formData.append("speakers", this.postPropForm.value.speakers)
        formData.append("microPhone", this.postPropForm.value.microphone)
        formData.append("guestHouse", this.postPropForm.value.guest_house)
        formData.append("kosha", this.postPropForm.value.kosha)

        formData.append("NoOfpools", this.postPropForm.value.no_of_pool)
        formData.append("livingRooms", this.postPropForm.value.no_of_living_room)
        formData.append("lift", this.postPropForm.value.lift)
        formData.append("duplex", this.postPropForm.value.duplex)
        formData.append("airConditioner", this.postPropForm.value.ac)
        formData.append("noOfOfficeOrSize", this.postPropForm.value.no_of_office)
        formData.append("noOfStores", this.postPropForm.value.no_of_stores)

        formData.append("bbq", this.postPropForm.value.bbq)
        formData.append("footballArea", this.postPropForm.value.football)
        formData.append("greenArea", this.postPropForm.value.greenArea)
        formData.append("volleyBall", this.postPropForm.value.valleball)
        formData.append("playGround", this.postPropForm.value.plyground)
        formData.append("wifi", this.postPropForm.value.wifi)
        formData.append("furnished", this.postPropForm.value.Furnished)
        formData.append("garage", this.postPropForm.value.Garage)
        formData.append("bathroomLady", this.postPropForm.value.BathroomforLady)
        formData.append("bathroomMen", this.postPropForm.value.BathroomforMen)
        formData.append("avaliablePm", this.postPropForm.value.avaliablePm)
        formData.append("avaliableAm", this.postPropForm.value.avaliableAm)
        formData.append("nearSevices", this.postPropForm.value.near_by_services)

        formData.append("lat", this.latitude.toString())
        formData.append("long", this.longitude.toString())
        for (let i = 0; i < this.uploadFile.length; i++) {
            formData.append(`images[${i}]`, this.uploadFile[i])
        }
        for (let i = 0; i < this.imageCaption.length; i++) {
            formData.append(`imageCaption[${i}]`, this.imageCaption[i])
        }
        let url = `${environment.api_url}mobile/updateProperty`
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
    ngAfterViewInit() {
        this.commonService.showLoader = true
        let url = `${environment.api_url}mobile/getPropertyDetails`
        let data = {
            propertyId: this.propertyId,
            userId: localStorage.getItem("user_id")
        }
        this.apiService.postData(url, data).subscribe(result => {
            this.commonService.showLoader = false
            if (result.status == "true") {
                this.propertyDetail = result.data
                this.formPatch();
            }
        }, error => {
            this.commonService.showLoader = false
            this.apiService.log(error)

        })
    }
    formPatch() {
        this.latitude = this.propertyDetail.lat;
        this.longitude = this.propertyDetail.long;
        for (let item of this.propertyDetail.imagesFile) {
            this.uploadFileUrls = [...this.uploadFileUrls, item.image]
            this.imageCaption = [...this.imageCaption, item.imageCaption]
        }
        let available_for_booking = 'No'
        if (this.propertyDetail.Type == "rentevent") {
            this.forBooking({ target: { value: 'Yes' } })
            available_for_booking = 'Yes'
        }
        this.postPropForm.patchValue({
            available_for_booking,
            title: this.propertyDetail.title,
            categories: this.propertyDetail.category,
            status: this.propertyDetail.status,
            purpose: this.propertyDetail.purpose,
            available_for: this.propertyDetail.available,
            bedrooms: this.propertyDetail.bedrooms,
            bathrooms: this.propertyDetail.bathrooms,
            kitchens: this.propertyDetail.kitchens,
            floors: this.propertyDetail.floor,
            plot_size: this.propertyDetail.plotSize,
            plot_size_in: this.propertyDetail.builtSizeUnit,
            built_size: this.propertyDetail.builtSize,
            built_size_in: this.propertyDetail.builtSizeUnit,
            length_size: this.propertyDetail.length,
            length_in: this.propertyDetail.lengthUnit,
            description: this.propertyDetail.description,
            width_size: this.propertyDetail.width,
            width_size_in: this.propertyDetail.widthUnit,
            built_year: this.propertyDetail.yearBuilt,
            street_view: this.propertyDetail.streetView,
            street_width: this.propertyDetail.streetWidth,
            street_width_in: this.propertyDetail.streetWidthUnit,
            appartment: this.propertyDetail.extrabuildingNo,
            no_of_showroom: this.propertyDetail.extrashowroomNo,
            balcony: this.propertyDetail.balcony.toString(),
            garden: this.propertyDetail.garden.toString(),
            parking: this.propertyDetail.parking.toString(),
            kitchen: this.propertyDetail.modularKitchen.toString(),
            indoor: this.checkBoxPatchValue(this.propertyDetail.indoor, 'indoor'),
            outdoor: this.checkBoxPatchValue(this.propertyDetail.outdoor, 'outdoor'),
            furnishing: this.checkBoxPatchValue(this.propertyDetail.furnish, 'furnishing'),
            parkings: this.checkBoxPatchValue(this.propertyDetail.parkingOption, 'parkings'),
            view: this.checkBoxPatchValue(this.propertyDetail.view, 'view'),
            special_offer: this.propertyDetail.specialOffer.toString(),
            total: this.propertyDetail.totalPrice,
            size: this.propertyDetail.sizem2,
            rent_time: this.propertyDetail.rentTime,
            province: this.propertyDetail.province,
            city: this.propertyDetail.city,
            district: this.propertyDetail.district,
            address: this.propertyDetail.address,
            building_name: this.propertyDetail.buildingNo,
            additional_number: this.propertyDetail.additionalNo,
            street_name: this.propertyDetail.streetName,
            zip: this.propertyDetail.zipcode,
            selected_date: this.propertyDetail.selectDate,
            payment_method: this.propertyDetail.paymentMethod,
            selected_offer_date: this.propertyDetail.offer,
            price_with_buffet: this.propertyDetail.priceWithBuffet,
            price_without_buffet: this.propertyDetail.priceWithoutBuffet,
            no_of_chairs: this.propertyDetail.noOfChairs,
            no_of_tables: this.propertyDetail.noOfTables,
            speakers: this.propertyDetail.speakers.toString(),
            insurance: this.propertyDetail.insurance.toString(),
            price: this.propertyDetail.price,
            price_based_on: this.propertyDetail.priceBasedOn,
            hall_size: this.propertyDetail.hallSize,
            projector: this.propertyDetail.projector.toString(),
            sound_system: this.propertyDetail.soundSystems.toString(),
            microphone: this.propertyDetail.microPhone.toString(),
            guest_house: this.propertyDetail.guestHouse.toString(),
            kosha: this.propertyDetail.kosha.toString(),
            no_of_pool: this.propertyDetail.NoOfpools,
            no_of_living_room: this.propertyDetail.livingRooms,
            lift: this.propertyDetail.lift.toString(),
            duplex: this.propertyDetail.duplex.toString(),
            ac: this.propertyDetail.airConditioner.toString(),
            no_of_office: this.propertyDetail.noOfOfficeOrSize,
            no_of_stores: this.propertyDetail.noOfStores,
            bbq: this.propertyDetail.bbq.toString(),
            football: this.propertyDetail.footballArea.toString(),
            greenArea: this.propertyDetail.greenArea.toString(),
            valleball: this.propertyDetail.volleyBall.toString(),
            plyground: this.propertyDetail.playGround.toString(),
            wifi: this.propertyDetail.wifi.toString(),
            Garage: this.propertyDetail.garage.toString(),
            BathroomforLady: this.propertyDetail.bathroomLady.toString(),
            BathroomforMen: this.propertyDetail.bathroomMen.toString(),
            avaliablePm: this.propertyDetail.avaliablePm.toString(),
            avaliableAm: this.propertyDetail.avaliableAm.toString(),
            Furnished: this.propertyDetail.furnished.toString(),
            near_by_services: this.propertyDetail.nearSevices,

        })

        console.log(this.postPropForm.value);
        this.offerClick(this.propertyDetail.specialOffer)
    }
    checkBoxPatchValue(value = '', controlName) {
        let result = value.split(",").map((indoor, i) => {
            return indoor && this[controlName + "Data"][i].value
        })
        return result
    }
    clickedDate(data) {
        var unique = data.filter(this.onlyUnique);
        this.postPropForm.patchValue({
            selected_date: unique.join(",")
        })
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    offerClick(data) {
        if (data) {
            this.postPropForm.value.selected_date.split(",").map(value => {
                this.eventData.push({
                    date: value,
                    title: "Available"
                })
            })
            this.offerDate = true
            this.postPropForm.get('selected_offer_date').setValidators([Validators.required])
        } else {
            this.eventData = []
            this.offerDate = false
            this.postPropForm.get('selected_offer_date').clearValidators()
        }
        this.postPropForm.get('selected_offer_date').updateValueAndValidity();
    }

    avlClick(data) {


        var unique = data.filter(this.onlyUnique);
        this.postPropForm.patchValue({
            selected_offer_date: unique.join(",")
        })
    }
}
