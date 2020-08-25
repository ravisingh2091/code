
import { Component, OnInit } from '@angular/core';

import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { environment } from 'src/environments/environment.prod';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false } },
  ]
})
export class HomeComponent implements OnInit {

  public mainBannerArr = [];

  myInterval: number | false = 5000;
  slides: any[] = [];
  activeSlideIndex: number = 0;
  noWrapSlides: boolean = false;

  slider_caption = [
    {
      slider_title: 'Find Your House',
      slider_image: 'assets/img/bg-img/hero1.jpg'
    },
    {
      slider_title: 'Find Your Dream house',
      slider_image: 'assets/img/bg-img/hero2.jpg'
    },
    {
      slider_title: 'Find your perfect house',
      slider_image: 'assets/img/bg-img/hero3.jpg'
    }
  ]

  Property_caption = [
    {
      Property_title: 'Apartment for rent',
      Property_image: 'assets/img/bg-img/feature6.jpg'
    },
    {
      Property_title: 'Family Home',
      Property_image: 'assets/img/bg-img/feature5.jpg'
    },
    {
      Property_title: 'Office Building',
      Property_image: 'assets/img/bg-img/feature1.jpg'
    },
    {
      Property_title: 'Resort Villas',
      Property_image: 'assets/img/bg-img/feature2.jpg'
    },
    {
      Property_title: 'Office Building',
      Property_image: 'assets/img/bg-img/feature1.jpg'
    },
    {
      Property_title: 'Resort Villas',
      Property_image: 'assets/img/bg-img/feature2.jpg'
    }
  ]

  Testimonial_caption = [
    {
      Testimonial_title: 'Perfect Home for Family',
      Testimonial_Describe: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      Testimonial_image: 'assets/img/bg-img/feature6.jpg',
      Testimonial_Name: 'Daiane Smith,',
      Testimonial_Post: 'Customer'
    },
    {
      Testimonial_title: 'Perfect Home for Family',
      Testimonial_Describe: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      Testimonial_image: 'assets/img/bg-img/feature6.jpg',
      Testimonial_Name: 'Daiane Smith,',
      Testimonial_Post: 'Customer'
    },
    {
      Testimonial_title: 'Perfect Home for Family',
      Testimonial_Describe: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      Testimonial_image: 'assets/img/bg-img/feature6.jpg',
      Testimonial_Name: 'Daiane Smith,',
      Testimonial_Post: 'Customer'
    },
    {
      Testimonial_title: 'Perfect Home for Family',
      Testimonial_Describe: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      Testimonial_image: 'assets/img/bg-img/feature6.jpg',
      Testimonial_Name: 'Daiane Smith,',
      Testimonial_Post: 'Customer'
    },
    {
      Testimonial_title: 'Perfect Home for Family',
      Testimonial_Describe: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      Testimonial_image: 'assets/img/bg-img/feature6.jpg',
      Testimonial_Name: 'Daiane Smith,',
      Testimonial_Post: 'Customer'
    },
    {
      Testimonial_title: 'Perfect Home for Family',
      Testimonial_Describe: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      Testimonial_image: 'assets/img/bg-img/feature6.jpg',
      Testimonial_Name: 'Daiane Smith,',
      Testimonial_Post: 'Customer'
    },
  ]
  featuredLists = []
  filterBy: any;
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private router: Router,
  ) {
    for (let i = 0; i < 4; i++) {
      this.addSlide();
    }
  }

  ngOnInit() {
    this.featuredProperties("all")
  }
  ngOnDestroy(): void {
    this.myInterval = 0;
    this.noWrapSlides = true;
    this.myInterval = false;
  }

  addSlide(): void {
    this.slides.push({
      image: `https://lorempixel.com/900/500/abstract/${this.slides.length % 8 + 1}/`
    });
  }

  removeSlide(index?: number): void {
    const toRemove = index ? index : this.activeSlideIndex;
    this.slides.splice(toRemove, 1);
  }
  featuredProperties(filterBy) {
    this.filterBy = filterBy
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/propertyListing`
    let data = {}
    data['Type'] = filterBy
    data['userId'] = localStorage.getItem("user_id")
    data['status'] = "active";
    data['view'] = "list";
    data['pageNo'] = '1'
    this.apiService.postData(url, data).subscribe(response => {
      this.commonService.showLoader = false
      if (response.status = "true") {
        this.featuredLists = response.data
      }

    })
  }
  searchSubmit(value) {
    let data = {
      userId: localStorage.getItem('user_id') || undefined,
      Type: this.filterBy,
      lat: value.lat,
      long: value.long,
      additionalId: value.add_id || undefined,
      available: value.available_for || undefined,
      modularKitchen: value.modular_kitchen || undefined,
      insurance: value.insurance || undefined,
      wifi: value.wifi || undefined,
      soundSystems: value.soundSystems || undefined,
      bedrooms: value.bedrooms || undefined,
      bathrooms: value.bedrooms || undefined,
      balcony: value.balcony || undefined,
      category: value.category || undefined,
      garden: value.garden || undefined,
      totalPriceMin: value.min_budget_size || undefined,
      totalPriceMax: value.max_budget_size || undefined,
      plotSizeMin: value.min_plot_size || undefined,
      plotSizeMax: value.max_plot_size || undefined,
      builtSizeMin: value.min_build_size || undefined,
      builtSizeMax: value.max_build_size || undefined,
      parking: value.parking || undefined,
      purpose: value.purpose || undefined,
      yearBuilt: value.year_of_build || undefined,
    }
    this.commonService.showLoader = true
    let url = `${environment.api_url}mobile/searchProperty`
    this.apiService.postData(url, data).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.featuredLists = result.data
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
        providerId: property._id,
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
}
