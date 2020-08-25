import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  NgZone,
  OnChanges
} from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnChanges {
  more: boolean = false
  @Input() filterBy: any
  @Output() formSubmit = new EventEmitter<{}>()
  categoryLists: any = [];
  numberList = []
  yearList = []
  searchForm: FormGroup;
  @ViewChild('search', { static: true })
  public searchElementRef: ElementRef;
  latitude: number;
  longitude: number;
  language: string
  constructor(
    private apiService: ApiService,
    private mapsAPILoader: MapsAPILoader,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private translate: TranslateService,
    private commonService: CommonService,
  ) {
    this.searchForm = this.fb.group({
      add_id: '',
      category: '',
      purpose: '',
      available_for: '',
      min_build_size: '',
      max_build_size: '',
      min_budget_size: '',
      max_budget_size: '',
      min_plot_size: '',
      max_plot_size: '',
      bedrooms: '',
      bathrooms: '',
      year_of_build: '',
      balcony: '',
      garden: '',
      parking: '',
      modular_kitchen: '',
      photos: '',
      insurance: '',
      wifi: '',
      soundSystems: '',
    })

    this.language = this.commonService.language;
    this.commonService._lang.subscribe(result => {
      this.language = result;
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.categoryData(this.filterBy);
  }

  ngOnInit() {
    for (let i = 0; i <= 100; i++) {
      this.numberList = [...this.numberList, i]
    }

    for (let i = new Date().getFullYear(); i >= 1900; i--) {
      this.yearList = [...this.yearList, i]
    }

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        // types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
        });
      });
    });
  }




  categoryData(Type) {
    let url = `${environment.api_url}mobile/getPropCategory`
    this.apiService.postData(url, { Type }).subscribe(result => {
      if (result.status == "true") {
        this.categoryLists = result.data
      }
    }, error => {
      this.apiService.log(error)
    })
  }
  searchSubmit() {
    this.searchForm.value.lat = this.latitude
    this.searchForm.value.long = this.longitude
    this.formSubmit.emit(this.searchForm.value)
  }
}
